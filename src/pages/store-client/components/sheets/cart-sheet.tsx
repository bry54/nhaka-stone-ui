import { useState } from 'react';
import { ShoppingCart, Minus, Plus, QrCode, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useStoreClient } from '../context';

export function StoreClientCartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) {
  const { state, getCartCount, getCartTotal, updateCartItemQuantity, removeCartItem } = useStoreClient();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const cartItem = state.cartItems[0]; // Single product
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const handleQuantityChange = (delta: number) => {
    if (cartItem) {
      const newQuantity = Math.max(1, cartItem.quantity + delta);
      updateCartItemQuantity(cartItem.productId, newQuantity);
    }
  };

  const handleRemoveItem = () => {
    if (cartItem) {
      removeCartItem(cartItem.productId);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <SheetBody className="px-5 py-0">
          <ScrollArea className="h-[calc(100dvh-12rem)] pe-3 -me-3">
            {cartItem ? (
              <div className="space-y-6 py-5">
                {/* Product Table Header */}
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {/* Product Row */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-900 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{cartItem.productName}</div>
                      <div className="text-xs text-muted-foreground">Offer: 1 Pack</div>
                      <button className="text-xs text-destructive hover:underline" onClick={handleRemoveItem}>Remove</button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center text-sm font-medium">
                    ${cartItem.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={cartItem.quantity <= 1}
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{cartItem.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right text-sm font-semibold">
                    ${(cartItem.price * cartItem.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Delivery Form */}
                <Card className="mt-6">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="text-base font-semibold">Delivery Information</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="mt-1" />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="address" className="text-sm">Address</Label>
                        <Input id="address" placeholder="123 Main St" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-sm">City</Label>
                        <Input id="city" placeholder="New York" className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-sm">State</Label>
                        <Input id="state" placeholder="NY" className="mt-1" />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="zip" className="text-sm">Zip Code</Label>
                        <Input id="zip" placeholder="10001" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Options */}
                <Card className="mt-4">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="text-base font-semibold">Payment Method</h3>

                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-3">
                        {/* Credit Card */}
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                            <CreditCard className="w-5 h-5" />
                            <span>Credit Card</span>
                          </Label>
                        </div>

                        {paymentMethod === 'credit-card' && (
                          <div className="ml-6 space-y-3 pt-2">
                            <div>
                              <Label htmlFor="cardNumber" className="text-sm">Card Number</Label>
                              <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="expiry" className="text-sm">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="cvv" className="text-sm">CVV</Label>
                                <Input id="cvv" placeholder="123" className="mt-1" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PayPal */}
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
                            <span className="text-lg">💳</span>
                            <span>PayPal</span>
                          </Label>
                        </div>

                        {/* Google Pay */}
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="google-pay" id="google-pay" />
                          <Label htmlFor="google-pay" className="flex items-center gap-2 cursor-pointer flex-1">
                            <span className="text-lg">🅖</span>
                            <span>Google Pay</span>
                          </Label>
                        </div>

                        {/* Apple Pay */}
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                          <RadioGroupItem value="apple-pay" id="apple-pay" />
                          <Label htmlFor="apple-pay" className="flex items-center gap-2 cursor-pointer flex-1">
                            <span className="text-lg"></span>
                            <span>Apple Pay</span>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Subtotal */}
                <div className="flex items-center justify-between bg-accent/50 rounded-lg p-3 mt-4">
                  <span className="text-sm font-medium">Total ({cartCount} items)</span>
                  <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add items to get started</p>
              </div>
            )}
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="flex-row border-t py-3.5 px-5 border-border gap-2">
          <Button variant="outline" onClick={onOpenChange}>Continue Shopping</Button>
          <Button variant="primary" className="grow" disabled={!cartItem}>
            <ShoppingCart />
            Place Order
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
