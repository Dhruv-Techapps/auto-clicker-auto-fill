import { openTelemetry } from './open-telemetry.js';

describe('openTelemetry', () => {
  it('should work', () => {
    expect(openTelemetry()).toEqual('open-telemetry');
  });
});
