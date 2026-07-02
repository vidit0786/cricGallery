export interface MonitoringEvent {
  name: string;
  timestamp?: string;
  properties?: Record<string, string | number | boolean | null>;
}

export interface MonitoringProvider {
  captureError(error: unknown, context?: Record<string, string | number | boolean | null>): void;
  captureEvent(event: MonitoringEvent): void;
  captureMetric(name: string, value: number, tags?: Record<string, string>): void;
}

class ConsoleMonitoringProvider implements MonitoringProvider {
  captureError(error: unknown, context?: Record<string, string | number | boolean | null>) {
    console.error(JSON.stringify({ type: "error", message: error instanceof Error ? error.message : "Unknown", context }));
  }

  captureEvent(event: MonitoringEvent) {
    console.log(JSON.stringify({ type: "event", ...event, timestamp: event.timestamp ?? new Date().toISOString() }));
  }

  captureMetric(name: string, value: number, tags?: Record<string, string>) {
    console.log(JSON.stringify({ type: "metric", name, value, tags, timestamp: new Date().toISOString() }));
  }
}

export const monitoring: MonitoringProvider = new ConsoleMonitoringProvider();
