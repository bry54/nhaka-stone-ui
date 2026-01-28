import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { UsersContent } from '.';

export function UsersPage() {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="System Users" />
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="primary">New User</Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <UsersContent />
      </Container>
    </Fragment>
  );
}
