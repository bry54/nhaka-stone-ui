import { MyOrders } from './components/my-orders';

interface MyOrdersContentProps {
  onTotalOrdersChange: (total: number) => void;
}

export function MyOrdersContent({ onTotalOrdersChange }: MyOrdersContentProps) {
  return <MyOrders onTotalOrdersChange={onTotalOrdersChange} />;
}
