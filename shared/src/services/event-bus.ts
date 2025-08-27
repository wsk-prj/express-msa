import Redis from "ioredis";

export class EventBus {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    const host = process.env.REDIS_HOST || "127.0.0.1";
    const port = parseInt(process.env.REDIS_PORT || "6379", 10);

    this.publisher = new Redis({ host, port, maxRetriesPerRequest: 3 });
    this.subscriber = new Redis({ host, port, maxRetriesPerRequest: 3 });
  }

  async publish(channel: string, data: unknown): Promise<void> {
    const payload = JSON.stringify({ data, ts: Date.now() });
    await this.publisher.publish(channel, payload);
  }

  async subscribe(channel: string, handler: (data: any) => Promise<void> | void): Promise<void> {
    await this.subscriber.subscribe(channel);

    this.subscriber.on("message", async (ch: string, message: string) => {
      if (ch !== channel) return;
      try {
        const parsed = JSON.parse(message) as { data: any };
        await handler(parsed.data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`[EventBus] handle error on ${channel}`, err);
      }
    });
  }

  async disconnect(): Promise<void> {
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}

export const eventBus = new EventBus();
