import * as cdk from '@aws-cdk/core';

export interface CdkCheckersProps {
  // Define construct properties here
}

export class CdkCheckers extends cdk.Construct {

  constructor(scope: cdk.Construct, id: string, props: CdkCheckersProps = {}) {
    super(scope, id);

    // Define construct contents here
  }
}
