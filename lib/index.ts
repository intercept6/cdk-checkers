import * as cdk from '@aws-cdk/core';

export interface CdkCheckersProps {
  // Define construct properties here
  dummy?: string;
}

export class CdkCheckers extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CdkCheckersProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
