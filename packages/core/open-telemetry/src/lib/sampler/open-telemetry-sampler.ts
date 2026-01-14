import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';

export const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1)
});
