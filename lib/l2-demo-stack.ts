import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class L2DemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Lambda function
    const demoFunction = new lambda.Function(this, 'DemoFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        RESPONSE_MESSAGE: 'L2 demo',
      },
    });

    // Create an API Gateway
    const api = new apigateway.RestApi(this, 'DemoApi', {
      restApiName: 'Demo API',
      description: 'This is a demo API.',
    });

    // Create an API Gateway resource and method
    const demoResource = api.root.addResource('demo');
    demoResource.addMethod('GET', new apigateway.LambdaIntegration(demoFunction));

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'The URL of the API Gateway',
    });
  }
}
