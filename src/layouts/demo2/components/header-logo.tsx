import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ROOT } from '@/config/menu.config';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/auth/providers/auth-provider';
import { UserRoles } from '@/types/contribution.types';

export function HeaderLogo() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Filter menu items based on user role
  const availableMenuItems = MENU_ROOT.filter(item => {
    // Admin users see all options
    if (user?.role === 'admin') {
      return true;
    }
    // Regular users only see Store - Client
    return item.title === 'Store - Client';
  });

  const [selectedMenuItem, setSelectedMenuItem] = useState(availableMenuItems[0]);

  useEffect(() => {
    availableMenuItems.forEach((item) => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname, availableMenuItems]);

  return (
    <div className="flex items-center gap-2 lg:gap-5 2xl:-ms-[60px]">
      {/* Logo Section */}
      <Link to="/" className="shrink-0">
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle.svg')}
          className="dark:hidden min-h-[42px]"
          alt="logo"
        />
        <img
          src={toAbsoluteUrl('/media/app/mini-logo-circle-dark.svg')}
          className="hidden dark:inline-block min-h-[42px]"
          alt="logo"
        />
      </Link>

      {/* Menu Section */}
      <div className="flex items-center gap-3">
        <h3 className="text-accent-foreground text-base hidden md:block">
          Nhaka Stone
        </h3>
        <span className="text-sm text-muted-foreground font-medium hidden md:inline">
          /
        </span>

        {/* Show dropdown only for admin users */}
        {user?.role === UserRoles.ADMIN ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer text-mono font-medium flex items-center gap-2">
              {selectedMenuItem?.title || 'Store - Client'}
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} side="bottom" align="start">
              {availableMenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  asChild
                  className={cn(item === selectedMenuItem && 'bg-accent')}
                >
                  <Link to={item.path || ''}>
                    {item.icon && <item.icon />}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="text-mono font-medium">
            Store - Client
          </span>
        )}
      </div>
    </div>
  );
}
