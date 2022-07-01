// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(req: NextRequest) {
  if (req.cookies['poll-user-token']) return;

  const res = NextResponse.next();
  res.cookie('poll-user-token', nanoid(), { sameSite: 'strict' });

  return res;
}
