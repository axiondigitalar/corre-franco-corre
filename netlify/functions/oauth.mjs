// Función de Netlify: guarda el secreto de Strava del lado del servidor.
// GET  -> devuelve los client_id públicos (Strava y Spotify)
// POST {action:'exchange', code} | {action:'refresh', refresh_token} -> tokens de Strava

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export default async (req) => {
  const stravaId = process.env.STRAVA_CLIENT_ID || '';
  const stravaSecret = process.env.STRAVA_CLIENT_SECRET || '';
  const spotifyId = process.env.SPOTIFY_CLIENT_ID || '';

  if (req.method === 'GET') {
    return json({ strava_client_id: stravaId, spotify_client_id: spotifyId });
  }
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405);
  if (!stravaId || !stravaSecret) {
    return json({ error: 'Faltan STRAVA_CLIENT_ID y STRAVA_CLIENT_SECRET en las variables de Netlify' }, 500);
  }

  let body;
  try { body = await req.json(); } catch { return json({ error: 'JSON inválido' }, 400); }

  const params = new URLSearchParams({ client_id: stravaId, client_secret: stravaSecret });
  if (body.action === 'exchange' && body.code) {
    params.set('code', body.code);
    params.set('grant_type', 'authorization_code');
  } else if (body.action === 'refresh' && body.refresh_token) {
    params.set('refresh_token', body.refresh_token);
    params.set('grant_type', 'refresh_token');
  } else {
    return json({ error: 'Acción inválida' }, 400);
  }

  const r = await fetch('https://www.strava.com/oauth/token', { method: 'POST', body: params });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) return json({ error: d.message || 'Strava rechazó el pedido', detail: d.errors || null }, r.status);

  const out = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at };
  if (d.athlete) out.athlete = { id: d.athlete.id, firstname: d.athlete.firstname, lastname: d.athlete.lastname };
  return json(out);
};
