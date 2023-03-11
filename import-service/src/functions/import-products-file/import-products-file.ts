import "source-map-support/register";

import {
  LambdaResponseBuilder,
  checkResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import * as AWS from "aws-sdk";
import { ConfigEnum } from "@libs/enums/config.enum";

const importFile: ValidatedEventAPIGatewayProxyEvent<any> = (event) =>
  checkResponse(async () => {
    const BucketName = ConfigEnum.BUCKET_NAME;
    const s3 = new AWS.S3({ region: ConfigEnum.REGION });
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: BucketName,
      Key: `uploaded/${event.queryStringParameters.name}`,
      Expires: 60,
      ContentType: "text/csv",
    });

    return new LambdaResponseBuilder(url).build();
  });

export const importProductsFile = middyfy(importFile);
