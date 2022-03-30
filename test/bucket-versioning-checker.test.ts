import {BucketVersioningChecker} from '../lib';
import {Template} from 'aws-cdk-lib/assertions';
import {Bucket} from 'aws-cdk-lib/aws-s3';
import {Aspects, App, Stack} from 'aws-cdk-lib';

describe('bucket versioning', () => {
  test('no error, if versioning is enable', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: true});

    Aspects.of(stack).add(new BucketVersioningChecker());

    const assembly = app.synth();
    const {messages} = assembly.getStackArtifact(stack.artifactId);

    expect(messages).toHaveLength(0);
  });

  test('raise error, if versioning is disable', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: false});

    Aspects.of(stack).add(new BucketVersioningChecker());

    const assembly = app.synth();
    const {messages} = assembly.getStackArtifact(stack.artifactId);

    expect(messages).toHaveLength(1);
    expect(messages[0].entry.type).toEqual('aws:cdk:error');
    expect(messages[0].entry.data).toEqual('Bucket versioning is no enabled');
  });

  test('fix to force versioning', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: false});

    Aspects.of(stack).add(new BucketVersioningChecker({fix: true}));

    const assembly = app.synth();
    const {messages} = assembly.getStackArtifact(stack.artifactId);

    expect(messages).toHaveLength(0);

    const template = Template.fromStack(stack);
    template.hasResource('AWS::S3::Bucket', {
      Type: 'AWS::S3::Bucket',
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
      Properties: {
        VersioningConfiguration: {
          Status: 'Enabled',
        },
      },
    });
  });
});
