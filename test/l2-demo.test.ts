import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as L2Demo from '../lib/l2-demo-stack';
import { HttpMethod } from 'aws-cdk-lib/aws-events';

describe('L2DemoStack', () => {
    let app: cdk.App;
    let stack: L2Demo.L2DemoStack;
    let template: Template;

    beforeEach(() => {
        app = new cdk.App();
        stack = new L2Demo.L2DemoStack(app, 'MyTestStack');
        template = Template.fromStack(stack);
    });

    test('Lambda Function Created', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Handler: 'index.handler',
            Runtime: 'nodejs18.x',
            Environment: {
                Variables: {
                    RESPONSE_MESSAGE: 'L2 demo'
                }
            }
        });
    });

    test('API Gateway Created', () => {
        template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    });

    test('API Gateway Resource Created', () => {
        template.hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'demo'
        });
    });

    test('API Gateway Method Created', () => {
        template.hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: {
                Ref: Match.stringLikeRegexp("DemoApidemo")
            },
            RestApiId: {
                Ref: Match.stringLikeRegexp("DemoApi")
            }
        });
    });

    test('API Gateway Deployment Created', () => {
        template.resourceCountIs('AWS::ApiGateway::Deployment', 1);
    });

    test('API Gateway Stage Created', () => {
        template.hasResourceProperties('AWS::ApiGateway::Stage', {
            StageName: 'prod'
        });
    });

    test('Lambda Permission for API Gateway Created', () => {
        template.hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            Principal: 'apigateway.amazonaws.com'
        });
    });

    test('API URL Output Created', () => {
        template.hasOutput('ApiUrl', {
            Description: 'The URL of the API Gateway'
        });
    });
});
