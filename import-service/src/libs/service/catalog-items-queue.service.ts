import { SQS } from "aws-sdk";

class CatalogItemQueueService {
  private url: string = process.env.SQS_URL;
  private sqs: SQS = new SQS({ region: "eu-central-1" });

  async addToQueue(data: NotificationMessage): Promise<void> {
    const payload: string = JSON.stringify(data);

    await this.sqs
      .sendMessage({
        QueueUrl: this.url,
        MessageBody: payload,
      })
      .promise();
  }
}

export interface NotificationMessage {
  success: boolean;
  message: string;
}

export type { CatalogItemQueueService };
export default new CatalogItemQueueService();