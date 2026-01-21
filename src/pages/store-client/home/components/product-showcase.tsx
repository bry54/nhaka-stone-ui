import { useState } from 'react';
import { User, PenSquare, Image, MessageSquare, Check, Minus, Plus, QrCode } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ProductShowcase() {
    const [selectedPack, setSelectedPack] = useState(3);
    const [quantity, setQuantity] = useState(30);

    const features = [
        { icon: User, text: 'Create a personalised memorial profile for your loved one' },
        { icon: PenSquare, text: 'Write a biography to share their life story' },
        { icon: Image, text: 'Bring their story to life with photos and videos' },
        { icon: MessageSquare, text: 'Friends, family & visitors can add heartfelt tribute comments' },
    ];

    const productFeatures = [
        'Keep their memory alive',
        'Upload photos & videos',
        'Weatherproof medallion',
        'No monthly fees',
    ];

    const handleQuantityChange = (delta: number) => {
        setQuantity(Math.max(1, quantity + delta));
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 p-6">
            {/* Left Side - Product Features */}
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 lg:p-12">
                <div className="flex flex-col gap-8">
                    {/* Product Image and Feature Callouts Side by Side */}
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        {/* Product Image Placeholder */}
                        <div className="flex justify-center">
                            <div className="w-48 h-48 bg-gray-900 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl">
                                <div className="text-center text-white">
                                    <div className="text-sm mb-2 flex items-center justify-center"><QrCode /></div>
                                    <div className="text-xs opacity-70">NHAKA-STONE</div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Callouts */}
                        <div className="grid gap-4">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-white/80 dark:bg-blue-950/50 rounded-2xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                                        <feature.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-sm text-blue-900 dark:text-blue-100">
                                            {feature.text.split('**').map((part, i) =>
                                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col gap-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        {/* Product Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-4">
                                Nhaka Stone Medallion
                            </h1>

                            {/* Testimonial */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <p className="text-sm text-muted-foreground italic">
                                    "I purchased this for my 32 year old sons grave. People have been amazed by it
                                    and have asked where I purchased it from. It's brilliant and so easy to use would
                                    100% recommend." - Tracey S.
                                </p>
                            </div>

                            {/* Price */}
                            <div className="text-4xl font-bold text-foreground mb-6">
                                USD 10.00 per medallion
                            </div>
                        </div>

                        {/* Product Features */}
                        <div className="space-y-3">
                            {productFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <div className="text-sm font-medium mb-3">Quantity</div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleQuantityChange(1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <Button className="w-full h-12 text-base font-semibold" size="lg">
                            Add to cart
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
