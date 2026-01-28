import { forwardRef } from 'react';
import { SystemUsers, SystemUsersRef } from './components';

export const UsersContent = forwardRef<SystemUsersRef>((_props, ref) => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <SystemUsers ref={ref} />
    </div>
  );
});

UsersContent.displayName = 'UsersContent';
