export async function getAuthenticatedOctokit(): Promise<{
  request: (...args: unknown[]) => Promise<unknown>;
}> {
  return {
    request: jest.fn()
  };
}
