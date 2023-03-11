import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

interface ErrorResponseBody {
  error?: string;
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response)
  }
}

export class LambdaResponseBuilder<T = ErrorResponseBody> {
  private response: APIGatewayProxyResult = {
    body: null,
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  };

  constructor(body: T = null) {
    this.response.body = JSON.stringify(body);
  }

  build(): APIGatewayProxyResult {
    return this.response;
  }

  setHeader(key: string, value: any): LambdaResponseBuilder<T> {
    this.response.headers[key] = value;
    return this;
  }

  setStatusCode(statusCode: number): LambdaResponseBuilder<T> {
    this.response.statusCode = statusCode;
    return this;
  }
}

export async function checkResponse(lambdaProxyIntegration: () => Promise<any>): Promise<any> {
  try {
    return await lambdaProxyIntegration()
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: null
    }
  }
}
