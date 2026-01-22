import { Fragment, useState } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { Container } from '@/components/common/container';
import { MyOrdersContent } from '.';

export function MyOrdersPage() {
  const [totalOrders, setTotalOrders] = useState(0);

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading>
            <ToolbarPageTitle text={`My Orders (${totalOrders})`} />
            <ToolbarDescription>View and manage your orders</ToolbarDescription>
          </ToolbarHeading>
        </Toolbar>
      </Container>
      <Container>
        <MyOrdersContent onTotalOrdersChange={setTotalOrders} />
      </Container>
    </Fragment>
  );
}
