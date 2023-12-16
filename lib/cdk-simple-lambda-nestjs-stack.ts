import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';
import { execSync } from 'child_process';

export class CdkSimpleLambdaNestjsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'CustomerTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for dev/test environments
    });

    // Build and prune the Lambda code (for convenience here. Typically this would be done using a separate build pipeline)
    const buildLambdaCode = (lambdaPath: string) => {
      console.log(`Building Lambda function at ${lambdaPath}`);
      execSync('npm install && npm run build', { cwd: lambdaPath, stdio: 'inherit' });
      execSync('npm prune --production', { cwd: lambdaPath, stdio: 'inherit' });
    };

    const lambdaPath = path.resolve(__dirname, '../lambda/nestjs');

    // Build and prune Lambda code
    buildLambdaCode(lambdaPath);

    // Define the Lambda function
    const nestJsLambda = new lambda.Function(this, 'CustomerCrudLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'dist/main_lambda.handler', // Assumes your Lambda code is in index.js
      code: lambda.Code.fromAsset(lambdaPath), // Path to your Lambda function code
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant Lambda function read and write permissions to the DynamoDB table
    table.grantReadWriteData(nestJsLambda);


    // Define the API Gateway
    const api = new apigateway.RestApi(this, 'CustomerLambdaApi', {
      restApiName: 'Customer Service',
      description: 'This service serves customers.'
    });

    // Integrate API Gateway with Lambda
    const integration = new apigateway.LambdaIntegration(nestJsLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' }
    });

    // Define a catch-all route that proxies all requests to the Lambda function
    api.root.addMethod('ANY', integration); // Catch-all for the root path
    const proxyResource = api.root.addResource('{proxy+}'); // Catch-all for any subpath
    proxyResource.addMethod('ANY', integration); // ANY method (GET, POST, PUT, DELETE, etc.)
  
    
    // Output the Lambda function ARN
    new cdk.CfnOutput(this, 'LambdaFunctionARN', {
      value: nestJsLambda.functionArn,
    });

    // Output the DynamoDB table name
    new cdk.CfnOutput(this, 'DynamoDBTableName', {
      value: table.tableName,
    });

    new cdk.CfnOutput(this, 'ApiGatewayURL', {
      value: api.url,
    });


  }
}
