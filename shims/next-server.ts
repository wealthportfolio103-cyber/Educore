/**
 * Browser-compatible Shim for Next.js Server APIs (NextResponse, NextRequest)
 * Allows Next.js App Router code and middleware to run smoothly in client previews.
 */

export class NextResponse extends Response {
  static next(init?: { request?: { headers?: HeadersInit } }) {
    return new NextResponse(null, {
      status: 200,
      headers: init?.request?.headers,
    });
  }

  static redirect(url: string | URL, status: number = 307) {
    const destination = typeof url === 'string' ? url : url.toString();
    return new NextResponse(null, {
      status,
      headers: {
        Location: destination,
      },
    });
  }

  static json(body: unknown, init?: ResponseInit) {
    return new NextResponse(JSON.stringify(body), {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers || {}),
      },
    });
  }
}

export type NextRequest = Request & {
  nextUrl: URL;
  cookies: {
    getAll: () => { name: string; value: string }[];
    set: (name: string, value: string) => void;
  };
};
