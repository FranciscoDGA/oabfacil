// evaluate-attempt — Edge Function (Deno)
// Avaliação pedagógica de respostas discursivas. NÃO é nota de banca e NÃO usa espelho oficial.
// Requer secret OPENAI_API_KEY (e opcional OPENAI_MODEL, padrão gpt-4o-mini).
// O platform injeta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY automaticamente.

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

const SYSTEM_PROMPT = `Você é um tutor de direito que avalia respostas discursivas de estudantes (nível introdutório a intermediário).

Regras permanentes:
- Você faz AVALIAÇÃO PEDAGÓGICA. Você NÃO atribui nota oficial de banca e NÃO inventa espelho de correção.
- Distinga: critério documentado no enunciado × sua avaliação × recomendação de estudo.
- Se o enunciado não trouxer critérios oficiais, deixe isso explícito em aviso_limitacoes.
- Não puna formulação diferente de um modelo quando for juridicamente defensável e responder ao enunciado.
- Cite dispositivos legais apenas se tiver segurança; se incerto, registre a incerteza.
- Aponte o trecho problemático, explique a falha e diga como corrigir. Nada de "boa resposta" genérico.
- Responda SOMENTE JSON válido com esta forma:
{
  "categorias": {
    "problema_juridico": {"diagnostico": "...", "orientacao": "...", "trecho": "..."},
    "conclusao": {"diagnostico": "...", "orientacao": "..."},
    "fundamentacao": {"diagnostico": "...", "orientacao": "..."},
    "aplicacao": {"diagnostico": "...", "orientacao": "..."},
    "dispositivos": {"diagnostico": "...", "orientacao": "..."},
    "omissoes": {"diagnostico": "...", "orientacao": "..."},
    "clareza": {"diagnostico": "...", "orientacao": "..."},
    "terminologia": {"diagnostico": "...", "orientacao": "..."}
  },
  "pontos_fortes": ["..."],
  "problemas": [{"trecho": "...", "falha": "...", "como_corrigir": "..."}],
  "recomendacoes": ["..."],
  "aviso_limitacoes": "..."
}
Preencha todas as chaves de "categorias". Use strings em português do Brasil.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

  let attemptVersionId: string;
  try {
    const body = await req.json();
    attemptVersionId = body?.attempt_version_id;
    if (!attemptVersionId || typeof attemptVersionId !== "string") {
      return json({ error: "attempt_version_id ausente." }, 400);
    }
  } catch {
    return json({ error: "Corpo inválido." }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey);

  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace(/^Bearer\s+/i, "");
  const { data: userData, error: userError } = await admin.auth.getUser(jwt);
  if (userError || !userData?.user) {
    return json({ error: "Não autenticado." }, 401);
  }
  const user = userData.user;

  const { data: version, error: versionError } = await admin
    .from("attempt_versions")
    .select("id, attempt_id, texto, numero")
    .eq("id", attemptVersionId)
    .single();
  if (versionError || !version) {
    return json({ error: "Versão não encontrada." }, 404);
  }

  const { data: attempt, error: attemptError } = await admin
    .from("attempts")
    .select("id, user_id, exercise_id")
    .eq("id", version.attempt_id)
    .single();
  if (attemptError || !attempt) {
    return json({ error: "Tentativa não encontrada." }, 404);
  }
  if (attempt.user_id !== user.id) {
    return json({ error: "Acesso negado." }, 403);
  }

  const { data: exercise, error: exerciseError } = await admin
    .from("writing_exercises")
    .select("titulo, enunciado, area, criterios, fonte")
    .eq("id", attempt.exercise_id)
    .single();
  if (exerciseError || !exercise) {
    return json({ error: "Exercício não encontrado." }, 404);
  }

  if (!version.texto || version.texto.trim().length < 30) {
    return json({ error: "A resposta está vazia ou curta demais para avaliação." }, 400);
  }

  if (!openaiKey) {
    return json({
      status: "nao_configurada",
      message:
        "A avaliação por IA ainda não está configurada no servidor (falta o secret OPENAI_API_KEY). Seu texto continua salvo.",
    }, 501);
  }

  const criteriosTexto = (exercise.criterios ?? [])
    .map((c: { titulo: string; orientacao: string }) => `- ${c.titulo}: ${c.orientacao}`)
    .join("\n");

  const userPrompt = `EXERCÍCIO (${exercise.area}) — ${exercise.titulo}
Fonte do exercício: ${JSON.stringify(exercise.fonte)}

ENUNCIADO:
${exercise.enunciado}

CRITÉRIOS DE AVALIAÇÃO (pedagógicos, definidos no cadastro do exercício):
${criteriosTexto || "(sem critérios específicos cadastrados)"}

RESPOSTA DO ESTUDANTE (versão ${version.numero}):
${version.texto}

Avalie a resposta do estudante segundo os critérios e as regras permanentes.`;

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenAI error:", resp.status, errText);
      await admin.from("evaluations").insert({
        attempt_version_id: version.id,
        modelo: model,
        status: "falhou",
        aviso_limitacoes: `Falha ao consultar o serviço de IA (HTTP ${resp.status}). A resposta do estudante foi preservada.`,
      });
      return json({
        status: "falhou",
        message: "A avaliação não foi concluída (falha no serviço de IA). Seu texto foi preservado — tente novamente.",
      }, 502);
    }

    const completion = await resp.json();
    const raw = completion?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const categorias = (parsed.categorias ?? {}) as Record<string, unknown>;
    const pontos_fortes = Array.isArray(parsed.pontos_fortes) ? parsed.pontos_fortes : [];
    const problemas = Array.isArray(parsed.problemas) ? parsed.problemas : [];
    const recomendacoes = Array.isArray(parsed.recomendacoes) ? parsed.recomendacoes : [];
    const aviso =
      (typeof parsed.aviso_limitacoes === "string" && parsed.aviso_limitacoes) ||
      "Avaliação pedagógica gerada por IA. Não é nota oficial e não reproduz o espelho de nenhuma banca.";

    const { data: inserted, error: insertError } = await admin
      .from("evaluations")
      .insert({
        attempt_version_id: version.id,
        modelo: model,
        status: "ok",
        categorias,
        pontos_fortes,
        problemas,
        recomendacoes,
        aviso_limitacoes: aviso,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert evaluation error:", insertError);
      return json({ status: "falhou", message: "A avaliação foi gerada, mas não pôde ser salva. Tente novamente." }, 500);
    }

    return json(inserted);
  } catch (err) {
    console.error("Unexpected error:", err);
    return json({
      status: "falhou",
      message: "A avaliação não foi concluída. Seu texto foi preservado.",
    }, 500);
  }
});
