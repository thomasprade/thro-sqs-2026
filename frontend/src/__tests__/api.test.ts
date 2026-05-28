import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const TOKEN_KEY = 'auth_token';

describe('apiFetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    globalThis.fetch = originalFetch;
  });

  it('attaches Authorization header when token exists in localStorage', async () => {
    localStorage.setItem(TOKEN_KEY, 'my-jwt-token');
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );

    const { fetchRecipes } = await import('../api');
    await fetchRecipes();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.any(Headers),
      }),
    );

    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = callArgs[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer my-jwt-token');
  });

  it('does not attach Authorization header when no token', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200 }),
    );

    const { fetchRecipes } = await import('../api');
    await fetchRecipes();

    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    const headers = callArgs[1]?.headers as Headers;
    expect(headers.get('Authorization')).toBeNull();
  });

  it('dispatches auth:unauthorized event on 401 response', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    const listener = vi.fn();
    globalThis.addEventListener('auth:unauthorized', listener);

    const { fetchRecipes } = await import('../api');
    await expect(fetchRecipes()).rejects.toThrow();

    expect(listener).toHaveBeenCalled();
    globalThis.removeEventListener('auth:unauthorized', listener);
  });

  it('loginRequest does not use apiFetch (no auth header needed)', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'new-token' }), { status: 200 }),
    );

    const { loginRequest } = await import('../api');
    const token = await loginRequest('user', 'pass');

    expect(token).toBe('new-token');
    const callArgs = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(callArgs[0]).toBe('/api/auth/login');
  });
});
