import type { NextFetchEvent, NextRequest } from 'next/server';

export function middleware(request: NextRequest, ev: NextFetchEvent) {
  console.log('Request: ', request);
  console.log('Event: ', ev);
}
