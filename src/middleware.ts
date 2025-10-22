import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Skip user auth check temporarily to allow access to everything
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/workouts/:path*', '/login'],
};
