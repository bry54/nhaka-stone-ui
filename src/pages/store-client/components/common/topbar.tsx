import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { ShoppingCart, UserCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStoreClient } from '../context';

export function StoreClientTopbar() {
  const { pathname } = useLocation();
  const { showCartSheet, getCartCount, getCartTotal } = useStoreClient();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  return (
    <>
      <div className="flex items-center gap-1">
        <UserDropdownMenu
          trigger={
            <Button
              variant="ghost"
              size="lg"
              mode="icon"
              shape="circle"
              className="hover:text-primary"
            >
              <UserCircle className="size-5!" />
            </Button>
          }
        />

        {/* Cart */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            mode="icon"
            shape="circle"
            onClick={showCartSheet}
            className="relative hover:text-primary"
          >
            <ShoppingCart className="size-5!" />
            {cartCount > 0 && (
              <Badge
                className="absolute top-0.5 end-0.5"
                variant="success"
                size="xs"
                shape="circle"
              >
                {cartCount}
              </Badge>
            )}
          </Button>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-secondary-foreground">
              Total
            </span>
            <span className="text-xs font-medium text-dark">${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
