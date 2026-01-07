import { ExportResult, ExportResultCode } from '@opentelemetry/core';
import { JsonLogsSerializer, JsonTraceSerializer } from '@opentelemetry/otlp-transformer';
import { LogRecordExporter, ReadableLogRecord } from '@opentelemetry/sdk-logs';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { RUNTIME_MESSENGER_OPEN_TELEMETRY } from '../open-telemetry-constant';

export class ServiceWorkerTraceExporter implements SpanExporter {
  /**
   * Export spans.
   * @param spans
   * @param resultCallback
   */
  export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void {
    return this._sendSpans(spans, resultCallback);
  }

  /**
   * Shutdown the exporter.
   */
  shutdown(): Promise<void> {
    this._sendSpans([]);
    return this.forceFlush();
  }

  /**
   * Exports any pending spans in exporter
   */
  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * converts span info into more readable format
   * @param span
   */
  private _exportInfo(spans: ReadableSpan[]) {
    const request = JsonTraceSerializer.serializeRequest(spans);
    const decoder = new TextDecoder();
    const documentedRequest = decoder.decode(request);
    console.debug('Serialized Spans for export:', documentedRequest);
    return documentedRequest;
  }

  /**
   * Showing spans in console
   * @param spans
   * @param done
   */
  private _sendSpans(spans: ReadableSpan[], done?: (result: ExportResult) => void): void {
    chrome.runtime.sendMessage({
      messenger: RUNTIME_MESSENGER_OPEN_TELEMETRY,
      methodName: 'exportSpan',
      message: this._exportInfo(spans)
    });

    if (done) {
      return done({ code: ExportResultCode.SUCCESS });
    }
  }
}

export class ServiceWorkerLogExporter implements LogRecordExporter {
  /**
   * Export logs.
   * @param logs
   * @param resultCallback
   */
  public export(logs: ReadableLogRecord[], resultCallback: (result: ExportResult) => void) {
    this._sendLogRecords(logs, resultCallback);
  }

  /**
   * Shutdown the exporter.
   */
  public shutdown(): Promise<void> {
    return Promise.resolve();
  }

  /**
   * converts logRecord info into more readable format
   * @param logRecord
   */
  private _exportInfo(logRecords: ReadableLogRecord[]) {
    const request = JsonLogsSerializer.serializeRequest(logRecords);
    const decoder = new TextDecoder();
    const documentedRequest = decoder.decode(request);
    console.debug('Serialized Logs for export:', documentedRequest);
    return documentedRequest;
  }

  /**
   * Showing logs  in console
   * @param logRecords
   * @param done
   */
  private _sendLogRecords(logRecords: ReadableLogRecord[], done?: (result: ExportResult) => void): void {
    chrome.runtime.sendMessage({
      messenger: RUNTIME_MESSENGER_OPEN_TELEMETRY,
      methodName: 'exportLogRecord',
      message: this._exportInfo(logRecords)
    });

    done?.({ code: ExportResultCode.SUCCESS });
  }
}
