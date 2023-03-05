import { APIGatewayProxyResult } from "aws-lambda";
import { validate, ValidationError } from "class-validator";
import http from "http";
import { ResponseBuilder } from "@libs/api-gateway";

export async function validatePostProductsBody(
  dto: Record<string, any>,
  dtoName?: string
): Promise<APIGatewayProxyResult | void> {
  try {
    const validatedObjectName = dtoName || dto.constructor.name || "data";
    console.log(`Start validating ${validatedObjectName}...`);
    const validationErrors = await validate(dto);

    if (validationErrors.length) {
      console.log(`${validatedObjectName} validation failed!`);

      return new ResponseBuilder({
        errors: validationErrors,
      })
        .setStatusCodeOfRequest(400)
        .build();
    }

    console.log(`${validatedObjectName} validation finished with response 200!`);
    return undefined;
  } catch (err) {
    if (!(err instanceof ValidationError)) {
      console.error("Errored validation", err);
      err = http.STATUS_CODES[400];
    }

    return new ResponseBuilder({ error: err }).setStatusCodeOfRequest(400).build();
  }
}