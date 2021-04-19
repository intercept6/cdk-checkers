import {CfnBucket} from '@aws-cdk/aws-s3';
import {Annotations, IAspect, IConstruct, Tokenization} from '@aws-cdk/core';

/**
 * Verify that the S3 bucket configures for versioning.
 */
export class BucketVersioningChecker implements IAspect {
  private readonly fix: boolean;

  constructor(props?: {fix?: boolean}) {
    this.fix = props?.fix ?? false;
  }

  public visit(node: IConstruct) {
    if (node instanceof CfnBucket) {
      if (
        !node.versioningConfiguration ||
        (!Tokenization.isResolvable(node.versioningConfiguration) &&
          node.versioningConfiguration.status !== 'Enabled')
      ) {
        if (this.fix) {
          node.addPropertyOverride('VersioningConfiguration', {
            Status: 'Enabled',
          });
        } else {
          Annotations.of(node).addError('Bucket versioning is no enabled');
        }
      }
    }
  }
}
