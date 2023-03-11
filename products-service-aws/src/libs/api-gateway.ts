import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

interface ErrorResponseBody {
  error?: string;
}

export class ResponseBuilder<T = ErrorResponseBody> {
  #response: APIGatewayProxyResult = {
    body: null,
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  };

  constructor(body: T = null) {
    this.#response.body = JSON.stringify(body);
  }

  build(): APIGatewayProxyResult {
    return this.#response;
  }

  setHeader(key: string, value: any): ResponseBuilder<T> {
    this.#response.headers[key] = value;
    return this;
  }

  setStatusCodeOfRequest(statusCode: number): ResponseBuilder<T> {
    this.#response.statusCode = statusCode;
    return this;
  }
}

export const formatJSONResponse = (response: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  };
};

export async function returnStatusErrors(
  lambdaProxyIntegration: () => Promise<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> {
  try {
    return await lambdaProxyIntegration();
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: null,
    };
  }
}
