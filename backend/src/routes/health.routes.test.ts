/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import * as fs from 'fs';
import healthRouter from './health.routes';

// Helper to extract handler for GET /health
function getHealthHandler() {
  const layer = (healthRouter as any).stack.find((l: any) => l.route && l.route.path === '/health' && l.route.methods.get);
  return layer.route.stack[0].handle;
}

function createMockRes() {
  return {
    statusCode: 200,
    body: undefined as any,
    status(code: number) { this.statusCode = code; return this; },
    json(payload: any) { this.body = payload; return this; }
  };
}

jest.mock('fs');
const fsMock = fs as jest.Mocked<typeof fs>;

describe('health.routes', () => {
  const handler = getHealthHandler();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns healthy when all seed files exist', () => {
    // Mock existsSync to true for all paths
    fsMock.existsSync.mockImplementation(() => true);
    const req = { } as any;
    const res = createMockRes();
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK - Healthy');
    // Ensure description lists expected files
    expect(res.body.description).toContain('seed_data_clinics.json');
  });

  it('returns 500 with missing files', () => {
    // First two exist, others missing
    let callIndex = 0;
    fsMock.existsSync.mockImplementation(() => {
      callIndex++;
      return callIndex <= 2; // only first two files exist
    });
    const req = { } as any;
    const res = createMockRes();
    handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Missing seed data files');
    expect(Array.isArray(res.body.missingFiles)).toBe(true);
    expect(res.body.missingFiles.length).toBeGreaterThan(0);
  });
});
