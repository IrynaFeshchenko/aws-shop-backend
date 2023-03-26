import { SNS } from "aws-sdk";
import { NotificationMessage } from "./catalog-items-queue.service";

class EmailNotificationService {
  private topicArn: string = process.env.SNS_ARN;
  private sns: SNS = new SNS({ region: "eu-central-1" });

  async emailNotification(body: string): Promise<void> {
    const { message, success }: NotificationMessage = JSON.parse(body);

    await this.sns
      .publish({
        Subject: "Imported file processing info",
        Message: message,
        TopicArn: this.topicArn,
        MessageAttributes: {
          success: {
            DataType: "String",
            StringValue: `${success}`,
          },
        },
      })
      .promise();
  }
}

export default new EmailNotificationService();
export type { EmailNotificationService };