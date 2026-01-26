import { Fragment } from 'react';
import { Container } from '@/components/common/container';
import { MemorialsReviewContent } from './memorials-review-content.tsx';

export function MemorialsReviewPage() {
  return (
    <Fragment>
      <Container>
        <MemorialsReviewContent />
      </Container>
    </Fragment>
  );
}
