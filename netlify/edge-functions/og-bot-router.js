// netlify/edge-functions/og-bot-router.js
// Detekte WhatsApp/Facebook/Twitter/etc bots ki eseye "previzyalize" yon lyen pwodwi,
// e sèvi yo yon vèsyon HTML ak vrè meta tag (og:image) espesifik pwodwi a.
// Moun nòmal (navigatè) yo pase dwat sou app la, san chanjman.

export default async (request, context) => {
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|Googlebot/i.test(userAgent);

  if (!isBot) {
    return; // Kite Netlify sèvi app la nòmalman
  }

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/product\/([^/]+)/);
  if (!match) {
    return; // Se pa yon paj pwodwi, kite l pase nòmal
  }

  const slug = match[1];
  const ogUrl = `https://nzbnlecbtvbnulkknqbi.supabase.co/functions/v1/product-og?slug=${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(ogUrl);
    const html = await response.text();
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (e) {
    return; // Si Edge Function la echwe, kite Netlify sèvi app la nòmal
  }
};

export const config = { path: "/product/*" };
