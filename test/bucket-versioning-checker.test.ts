import '@aws-cdk/assert/jest';
import {BucketVersioningChecker} from '../lib';
import {SynthUtils} from '@aws-cdk/assert';
import {Bucket} from '@aws-cdk/aws-s3';
import {Aspects, App, Stack} from '@aws-cdk/core';

describe('bucket versioning', () => {
  test('no error, if versioning is enable', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: true});

    Aspects.of(stack).add(new BucketVersioningChecker());
    const assembly = SynthUtils.synthesize(stack);
    expect(assembly.messages).toHaveLength(0);
  });

  test('raise error, if versioning is disable', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: false});

    Aspects.of(stack).add(new BucketVersioningChecker());
    const assembly = SynthUtils.synthesize(stack);
    assembly.messages.forEach(value => {
      expect(value.entry.type).toEqual('aws:cdk:error');
      expect(value.entry.data).toEqual('Bucket versioning is no enabled');
    });
  });

  test('fix to force versioning', () => {
    const app = new App();
    const stack = new Stack(app, 'test-stack');
    new Bucket(stack, 'bucket', {versioned: false});

    Aspects.of(stack).add(new BucketVersioningChecker({fix: true}));
    expect(stack).toHaveResource('AWS::S3::Bucket', {
      VersioningConfiguration: {
        Status: 'Enabled',
      },
    });
  });
});
