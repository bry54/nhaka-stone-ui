import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, QrCode, CreditCard, Loader2 } from 'lucide-react';
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
import api from '@/lib/api';
import { useAuth } from '@/auth/context/auth-context';
import type { PurchaseData } from '@/types/purchase.types';

export function StoreClientCartSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) {
  const { state, getCartCount, getCartTotal, updateCartItemQuantity, removeCartItem } = useStoreClient();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal' | 'google-pay' | 'apple-pay'>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);

  const [step, setStep] = useState(1);

  // Delivery form state - pre-filled with user data
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Update form when user data becomes available
  useEffect(() => {
    if (user) {
      console.log(user);
      setDeliveryInfo(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

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
      setStep(1); // Reset step if item removed (and cart becomes empty)
    }
  };

  const handleDeliveryChange = (field: string, value: string) => {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Basic validation for delivery info
    if (!deliveryInfo.fullName || !deliveryInfo.email || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Please fill in all required delivery fields.');
      return;
    }
    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (!cartItem) return;

    setIsProcessing(true);

    try {
      // Mock payment processing delay (1.5 seconds)
      const item = state.cartItems[0];

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate mock transaction ID (would come from payment gateway)
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const timestamp = new Date().toISOString();

      // Prepare purchase data with payment gateway information
      const purchaseData: PurchaseData = {
        // Order information
        orderId: `ORD-${Date.now()}`,
        orderDate: timestamp,

        // Item
        item: {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        },

        // Customer information
        customer: {
          id: user?.id,
          fullName: deliveryInfo.fullName,
          email: deliveryInfo.email,
          phone: deliveryInfo.phone,
        },

        // Delivery/Shipping information
        delivery: {
          fullName: deliveryInfo.fullName,
          email: deliveryInfo.email,
          phone: deliveryInfo.phone,
          address: deliveryInfo.address,
          city: deliveryInfo.city,
          state: deliveryInfo.state,
          zipCode: deliveryInfo.zipCode,
          country: 'Zimbabwe', // Could be a form field
        },

        // Payment information (from payment gateway)
        payment: {
          // Payment method details
          method: paymentMethod,
          provider: paymentMethod === 'credit-card' ? 'Stripe' :
            paymentMethod === 'paypal' ? 'PayPal' :
              paymentMethod === 'google-pay' ? 'Google Pay' : 'Apple Pay',

          // Transaction details (would come from payment processor)
          transactionId: transactionId,
          status: 'completed', // 'pending', 'completed', 'failed'
          timestamp: timestamp,

          // Amount details
          currency: 'USD',
          subtotal: cartTotal,
          tax: 0, // Could calculate tax
          shippingCost: 0, // Could add shipping
          discount: 0, // Could add discount codes
          totalAmount: cartTotal,

          // Payment processor response (mock data)
          processorResponse: {
            authorizationCode: `AUTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            receiptUrl: `https://payment-gateway.com/receipts/${transactionId}`,
            last4: paymentMethod === 'credit-card' ? '4242' : null, // Last 4 digits of card
            cardBrand: paymentMethod === 'credit-card' ? 'Visa' : null,
          },
        },

        // Order summary
        summary: {
          itemCount: cartCount,
          subtotal: cartTotal,
          total: cartTotal,
          currency: 'USD',
        },
      };

      // Call the purchase endpoint
      await api.post('/memorial-purchase', purchaseData);

      // Success
      alert(`Order placed successfully! Your order for ${cartCount} item(s) has been confirmed.`);

      // Clear cart
      removeCartItem(cartItem.productId);

      // Close sheet
      onOpenChange();

      // Reset form and step
      setDeliveryInfo({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });
      setStep(1);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Order failed. Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:w-[600px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>
            Shopping Cart {step === 2 && '- Payment'}
          </SheetTitle>
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

                {/* Step 1: Delivery Form */}
                {step === 1 && (
                  <Card className="mt-6">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="text-base font-semibold">Delivery Information</h3>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="Nhaka Stone"
                            className="mt-1"
                            value={deliveryInfo.fullName}
                            onChange={(e) => handleDeliveryChange('fullName', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-sm">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="user@nhaka-stone.com"
                            className="mt-1"
                            value={deliveryInfo.email}
                            onChange={(e) => handleDeliveryChange('email', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+263 777 777 777"
                            className="mt-1"
                            value={deliveryInfo.phone}
                            onChange={(e) => handleDeliveryChange('phone', e.target.value)}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="address" className="text-sm">Address</Label>
                          <Input
                            id="address"
                            placeholder="123 Main St, Zengeza"
                            className="mt-1"
                            value={deliveryInfo.address}
                            onChange={(e) => handleDeliveryChange('address', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="city" className="text-sm">City</Label>
                          <Input
                            id="city"
                            placeholder="Chitungwiza"
                            className="mt-1"
                            value={deliveryInfo.city}
                            onChange={(e) => handleDeliveryChange('city', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="state" className="text-sm">State</Label>
                          <Input
                            id="state"
                            placeholder="Zimbabwe"
                            className="mt-1"
                            value={deliveryInfo.state}
                            onChange={(e) => handleDeliveryChange('state', e.target.value)}
                          />
                        </div>

                        <div className="col-span-2">
                          <Label htmlFor="zip" className="text-sm">Zip Code</Label>
                          <Input
                            id="zip"
                            placeholder="10001"
                            className="mt-1"
                            value={deliveryInfo.zipCode}
                            onChange={(e) => handleDeliveryChange('zipCode', e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Payment Options */}
                {step === 2 && (
                  <Card className="mt-4">
                    <CardContent className="p-4 space-y-4">
                      <h3 className="text-base font-semibold">Payment Method</h3>

                      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
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
                )}

                {/* Subtotal - Always visible 
                <div className="flex items-center justify-between bg-accent/50 rounded-lg p-3 mt-4">
                  <span className="text-sm font-medium">Total ({cartCount} items)</span>
                  <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                */}
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
          {step === 1 ? (
            <>
              <Button variant="outline" onClick={onOpenChange}>Continue Shopping</Button>
              <Button variant="primary" className="grow" disabled={!cartItem} onClick={handleNextStep}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleBackStep} disabled={isProcessing}>Back</Button>
              <Button
                variant="primary"
                className="grow"
                disabled={isProcessing}
                onClick={handlePlaceOrder}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart />
                    Place Order
                  </>
                )}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
