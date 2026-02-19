export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,DELETE,OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "*",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const { pathname } = new URL(request.url);

    try {
      if (pathname === "/") {
        if (request.method === "GET") {
          const { results } = await env.DB.prepare("SELECT * FROM questions ORDER BY createdAt DESC").all();
          return Response.json(results, { headers: corsHeaders });
        } else if (request.method === "POST") {
          const { text } = await request.json();
          if (!text) {
            return new Response("Question text is required", { status: 400, headers: corsHeaders });
          }
          const now = new Date().toISOString();
          await env.DB.prepare("INSERT INTO questions (text, createdAt) VALUES (?, ?)")
            .bind(text, now)
            .run();
          return new Response("Question added", { status: 201, headers: corsHeaders });
        }
      } else if (pathname.startsWith("/")) {
        const id = pathname.split('/').pop();
        if (request.method === "DELETE") {
          const { success } = await env.DB.prepare("DELETE FROM questions WHERE id = ?").bind(id).run();
          if (success) {
            return new Response("Question deleted", { headers: corsHeaders });
          } else {
            return new Response("Question not found", { status: 404, headers: corsHeaders });
          }
        }
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (e) {
      console.error(e);
      return new Response(e.message, { status: 500, headers: corsHeaders });
    }
  },
};
