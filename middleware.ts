import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// contact.ishsitotombe.co.uk should show the outreach-landing content at its
// root, while the visible URL stays on the subdomain. Everything else
// (the main domain, any other path on the contact subdomain) passes through
// unchanged.
const CONTACT_HOST = 'contact.ishsitotombe.co.uk';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';

  if (host === CONTACT_HOST && request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/outreach-landing';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
