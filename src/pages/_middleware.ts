// middleware.ts
import { nanoid } from 'nanoid';
import { JWT } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function middleware(req: NextRequest & { nextauth?: { token: JWT | null } }) {
  const res = NextResponse.next();
  if (req.nextauth?.token) {
    res.clearCookie('poll-user-token');
    return res;
  }
  if (req.cookies['poll-user-token']) return res;
  res.cookie('poll-user-token', nanoid(), { sameSite: 'strict' });
  return res;
}

export default withAuth(middleware, {
  callbacks: {
    authorized: () => true,
  },
});
