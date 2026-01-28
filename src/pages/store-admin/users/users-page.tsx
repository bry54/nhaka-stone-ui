import { Fragment, useRef } from 'react';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/common/container';
import { UsersContent } from '.';
import { SystemUsersRef } from './components';

export function UsersPage() {
  const usersRef = useRef<SystemUsersRef>(null);

  const handleAddUser = () => {
    usersRef.current?.openAddUserSheet();
  };

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text="System Users" />
          </ToolbarHeading>
          <ToolbarActions>
            <Button variant="primary" onClick={handleAddUser}>New User</Button>
          </ToolbarActions>
        </Toolbar>
      </Container>
      <Container>
        <UsersContent ref={usersRef} />
      </Container>
    </Fragment>
  );
}
