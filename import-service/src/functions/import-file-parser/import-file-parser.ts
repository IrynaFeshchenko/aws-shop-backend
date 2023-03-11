import "source-map-support/register";

import { checkResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import ParseFileService from "@libs/service/files-import.service";
import { S3Handler } from "aws-lambda";

const parseFile: S3Handler = async (event) =>
  checkResponse(async () => {
    for (const record of event.Records) {
      await ParseFileService.parseAndMoveFile(record.s3.object.key);
    }
  });

export const importFileParser = middyfy(parseFile);
