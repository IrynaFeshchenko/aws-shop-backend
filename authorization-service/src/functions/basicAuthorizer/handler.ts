import {
  APIGatewayAuthorizerCallback,
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
} from "aws-lambda";

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  _ctx: any,
  cb: APIGatewayAuthorizerCallback
) => {
  console.log("Event: ", JSON.stringify(event));

  if (event.type !== "TOKEN") {
    throw new cb("Unauthorized");
  }
  const { authorizationToken } = event;
  const token = authorizationToken.replace("Basic ", "");
  const buffer = Buffer.from(token, "base64");
  const [user, password] = buffer.toString("utf8").split(":");
  const storedPassword = process.env[user];
  const effect =
    storedPassword && storedPassword === password ? "Allow" : "Deny";
  return generatePolicy(token, event.methodArn, effect);
};

export const generatePolicy = (
  principalId: string,
  resource: string,
  effect: string = "Allow"
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
