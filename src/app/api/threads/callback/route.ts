import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.NEXT_PUBLIC_THREADS_APP_ID;
const CLIENT_SECRET = process.env.THREADS_APP_SECRET;
const REDIRECT_URI = process.env.THREADS_REDIRECT_URI || 'http://localhost:3000/api/threads/callback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // 1. Exchange code for short-lived access token
    const shortTokenRes = await fetch('https://graph.threads.net/oauth/access_token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    });

    const shortTokenData = await shortTokenRes.json();
    if (shortTokenData.error) {
      return NextResponse.json({ error: shortTokenData.error_message }, { status: 400 });
    }

    const shortToken = shortTokenData.access_token;

    // 2. Exchange short-lived token for long-lived token (60 days)
    const longTokenRes = await fetch(
      `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${CLIENT_SECRET}&access_token=${shortToken}`
    );

    const longTokenData = await longTokenRes.json();
    if (longTokenData.error) {
      return NextResponse.json({ error: longTokenData.error_message }, { status: 400 });
    }

    const longToken = longTokenData.access_token;

    // 3. Redirect back to dashboard with token (Better to use Secure Cookies in production)
    // Here we just redirect to home and let the client handle it if they want to persist it.
    // For now, we recommend the user to still rely on THREADS_USER_TOKEN in .env for this single-user tool.
    
    return NextResponse.redirect(new URL(`/?token=${longToken}`, request.url));
  } catch (error) {
    console.error('OAuth Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
