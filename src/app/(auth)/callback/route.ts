import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
    console.log('✅ Session exchanged successfully');

  }

  // Redirect to dashboard after cookie is set
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
