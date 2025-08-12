import { jest } from '@jest/globals';

global.console = {
  ...console,
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.setTimeout(10000);

(global as Record<string, unknown>).testUtils = {
  createMockRequest: (body: Record<string, unknown> = {}, params: Record<string, unknown> = {}, query: Record<string, unknown> = {}) => ({
    body,
    params,
    query,
    headers: {},
  }),
  
  createMockResponse: () => {
    const res: Record<string, unknown> = {};
    (res as Record<string, unknown>).status = jest.fn().mockReturnValue(res);
    (res as Record<string, unknown>).json = jest.fn().mockReturnValue(res);
    (res as Record<string, unknown>).send = jest.fn().mockReturnValue(res);
    return res;
  },
};

declare global {
  let testUtils: {
    createMockRequest: (body?: Record<string, unknown>, params?: Record<string, unknown>, query?: Record<string, unknown>) => Record<string, unknown>;
    createMockResponse: () => Record<string, unknown>;
  };
}
