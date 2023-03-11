import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/import-file-parser.importFileParser`,
  events: [
    {
      s3: {
        bucket: `my-aws-import-epam`,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/'
          }
        ],
        existing: true
      }
    }
  ]
}