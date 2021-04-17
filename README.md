# CDK checkers

## Overview

It is a library that uses [Aspects](https://docs.aws.amazon.com/cdk/latest/guide/aspects.html) to test whether the constructs in the stack generated by AWS CDK meet the requirements.

## Install

```bash
# use npm
npm install --save-dev cdk-checkers
```

```bash
# use yarn
yarn add -D  cdk-checkers
```

## Example

In test

```typescript
import * as cdk from '@aws-cdk/core';
import * as assert from '@aws-cdk/assert';
import * as CdkAspectDemo from '../lib/cdk-aspect-demo-stack';
import * as checkers from 'cdk-checkers';

test('aspects test', () => {
  const app = new cdk.App();
  const stack = new CdkAspectDemo.CdkAspectDemoStack(app, 'test-stack');

  cdk.Aspects.of(stack).add(new checkers.BucketVersioningChecker());
  const assembly = assert.SynthUtils.synthesize(stack);
  assembly.messages.forEach(message => {
    expect(message).toEqual(
      expect.objectContaining({entry: {type: 'aws:cdk:error'}})
    );
  });
});
```

In entrypoint

```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as CdkAspectDemo from '../lib/cdk-aspect-demo-stack';
import * as checkers from 'cdk-checkers';

const app = new cdk.App();
const cdkAspectDemoStack = new CdkAspectDemo.CdkAspectDemoStack(
  app,
  'CdkAspectDemoStack'
);

cdk.Aspects.of(cdkAspectDemoStack).add(new checkers.BucketVersioningChecker());
```
