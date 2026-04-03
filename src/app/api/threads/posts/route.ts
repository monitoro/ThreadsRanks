import { NextResponse } from 'next/server';

const BASE_URL = 'https://graph.threads.net/v1.0';

function getToken() {
  return process.env.THREADS_USER_TOKEN || process.env.NEXT_PUBLIC_THREADS_USER_TOKEN || '';
}

export async function GET() {
  const token = getToken();
  
  if (!token) {
    return NextResponse.json({
      success: false,
      error: 'NO_TOKEN',
      posts: [],
    });
  }

  // 1. 게시물 목록 가져오기
  let rawPosts: any[] = [];
  try {
    const postsRes = await fetch(
      `${BASE_URL}/me/threads?fields=id,text,media_type,media_url,timestamp,permalink,username&limit=25&access_token=${token}`
    );
    if (postsRes.ok) {
      const data = await postsRes.json();
      rawPosts = data?.data || [];
    } else {
      const err = await postsRes.json();
      console.error('[API /posts] Posts fetch failed:', err);
      return NextResponse.json({
        success: false,
        error: 'POSTS_FAILED',
        message: err?.error?.message || 'Posts API failed',
        posts: [],
      });
    }
  } catch (e) {
    console.error('[API /posts] Network error:', e);
    return NextResponse.json({
      success: false,
      error: 'NETWORK_ERROR',
      posts: [],
    });
  }

  // 2. 각 게시물의 Insights 데이터 (최대 15개만 가져옴)
  const postsToFetch = rawPosts.slice(0, 15);
  
  const postsWithInsights = await Promise.all(
    postsToFetch.map(async (post: any) => {
      let insights: any = null;
      let insightsError: string | null = null;

      try {
        const insRes = await fetch(
          `${BASE_URL}/${post.id}/insights?metric=views,likes,replies,reposts,quotes&access_token=${token}`
        );
        if (insRes.ok) {
          const insData = await insRes.json();
          if (insData?.data) {
            insights = {};
            insData.data.forEach((m: any) => {
              insights[m.name] = m.values?.[0]?.value ?? m.total_value?.value ?? 0;
            });
          }
        } else {
          const err = await insRes.json();
          insightsError = err?.error?.message || 'Insights failed';
        }
      } catch (e) {
        insightsError = 'Network error';
      }

      return {
        id: post.id,
        text: post.text || null,
        media_type: post.media_type || 'TEXT',
        media_url: post.media_url || null,
        timestamp: post.timestamp,
        permalink: post.permalink,
        username: post.username,
        insights,
        insightsError,
      };
    })
  );

  // 나머지 게시물은 insights 없이 반환
  const remainingPosts = rawPosts.slice(15).map((post: any) => ({
    id: post.id,
    text: post.text || null,
    media_type: post.media_type || 'TEXT',
    media_url: post.media_url || null,
    timestamp: post.timestamp,
    permalink: post.permalink,
    username: post.username,
    insights: null,
    insightsError: 'Not fetched (over limit)',
  }));

  return NextResponse.json({
    success: true,
    posts: [...postsWithInsights, ...remainingPosts],
    totalCount: rawPosts.length,
  });
}
