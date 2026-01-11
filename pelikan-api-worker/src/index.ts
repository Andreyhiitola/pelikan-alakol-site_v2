const BACKEND_URL = "http://85.192.40.138:8080/api/order";
const ALLOWED_ORIGIN = "https://pelikan-alakol-site-v2.pages.dev";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname !== "/api/order") {
      return new Response("Not found", { status: 404 });
    }

    const origin = request.headers.get("Origin") || ALLOWED_ORIGIN;

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const backendResponse = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
    });

    const body = await backendResponse.text();

    return new Response(body, {
      status: backendResponse.status,
      headers: {
        "Content-Type":
          backendResponse.headers.get("Content-Type") ||
          "application/json; charset=utf-8",
        ...corsHeaders(origin),
      },
    });
  },
};
