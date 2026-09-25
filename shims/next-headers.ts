/**
 * Browser-compatible Shim for Next.js Headers API (cookies)
 */

export async function cookies() {
  return {
    getAll: () => [],
    set: (_name: string, _value: string, _options?: unknown) => {},
    get: (_name: string) => undefined,
    delete: (_name: string) => {},
  };
}

export async function headers() {
  return new Headers();
}
