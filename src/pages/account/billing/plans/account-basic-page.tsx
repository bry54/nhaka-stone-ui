import { Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Container } from '@/components/common/container';
import { AccountPlansContent } from '.';

export function AccountPlansPage() {

  return (
    <Fragment>
      <PageNavbar />
      <Container>
        <AccountPlansContent />
      </Container>
    </Fragment>
  );
}
