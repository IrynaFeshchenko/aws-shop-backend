import { checkResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import emailNotificationService from "@libs/service/email-notification.service";
import { SQSHandler } from "aws-lambda";
import "source-map-support/register";

export const batchHandler: SQSHandler = async (event) =>
  checkResponse(async () => {
    for (const record of event.Records) {
      console.log(record);
      await emailNotificationService.emailNotification(record.body);
    }
  });

export const catalogBatchProcess = middyfy(batchHandler);
