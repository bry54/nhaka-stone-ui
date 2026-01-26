import { StoreClientTopbar } from '@/pages/store-client/components/common/topbar';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { useLocation } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';

export function HeaderTopbar() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname.startsWith('/store-client') ? (
        <StoreClientTopbar />
      ) : (
        <div className="flex items-center gap-3">
          <UserDropdownMenu
            trigger={
              <img
                className="cursor-pointer size-9 rounded-full justify-center border border-gray-500 shrink-0"
                src={toAbsoluteUrl('/media/avatars/gray/5.png')}
                alt=""
              />
            }
          />
        </div>
      )}
    </>
  );
}
