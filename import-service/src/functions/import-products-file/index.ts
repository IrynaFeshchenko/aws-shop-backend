import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/import-products-file.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: 'arn:aws:lambda:eu-central-1:466419691213:function:my-aws-authorization-service-dev-basicAuthorizer'
      }
    }
  ]
}