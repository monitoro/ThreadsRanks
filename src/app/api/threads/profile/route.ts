import { NextResponse } from 'next/server';

const BASE_URL = 'https://graph.threads.net/v1.0';

function getToken() {
  // 서버사이드 전용 — 브라우저에 절대 노출되지 않음
  return process.env.THREADS_USER_TOKEN || process.env.NEXT_PUBLIC_THREADS_USER_TOKEN || '';
}

export async function GET() {
  const token = getToken();
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: 'NO_TOKEN',
      message: '토큰이 설정되지 않았습니다. Vercel 환경변수에 THREADS_USER_TOKEN을 추가하세요.',
      profile: null,
      followers: null,
    });
  }

  // 1. 기본 프로필 정보
  let profile = null;
  try {
    const profileRes = await fetch(
      `${BASE_URL}/me?fields=id,username,name,threads_profile_picture_url,threads_biography&access_token=${token}`
    );
    if (profileRes.ok) {
      profile = await profileRes.json();
    } else {
      const err = await profileRes.json();
      console.error('[API /profile] Profile fetch failed:', err);
      return NextResponse.json({
        success: false,
        error: 'PROFILE_FAILED',
        message: `프로필 API 실패: ${err?.error?.message || 'Unknown error'}`,
        detail: err,
        profile: null,
        followers: null,
      });
    }
  } catch (e) {
    console.error('[API /profile] Network error:', e);
    return NextResponse.json({
      success: false,
      error: 'NETWORK_ERROR',
      message: '메타 서버에 연결할 수 없습니다.',
      profile: null,
      followers: null,
    });
  }

  // 2. 팔로워 수 (별도 요청 — 실패해도 프로필은 보여줌)
  let followers: number | null = null;
  let followersError: string | null = null;
  try {
    const insightsRes = await fetch(
      `${BASE_URL}/me/threads_insights?metric=followers_count&access_token=${token}`
    );
    if (insightsRes.ok) {
      const insightsData = await insightsRes.json();
      const fMetric = insightsData?.data?.find((m: any) => m.name === 'followers_count');
      if (fMetric?.total_value?.value !== undefined) {
        followers = fMetric.total_value.value;
      } else if (fMetric?.values?.[0]?.value !== undefined) {
        followers = fMetric.values[0].value;
      }
    } else {
      const err = await insightsRes.json();
      followersError = err?.error?.message || 'Insights API failed';
      console.warn('[API /profile] Followers insight failed:', followersError);
    }
  } catch (e) {
    followersError = 'Network error fetching followers';
    console.warn('[API /profile] Followers network error:', e);
  }

  return NextResponse.json({
    success: true,
    profile,
    followers,
    followersError,
  });
}
