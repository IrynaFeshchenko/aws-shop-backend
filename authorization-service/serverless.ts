import type { AWS } from '@serverless/typescript';
import { basicAuthorizer } from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'my-aws-authorization-service',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { basicAuthorizer },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
};

module.exports = serverlessConfiguration;
