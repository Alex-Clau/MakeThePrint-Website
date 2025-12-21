import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock cart data
const cartItems = [
  {
    id: "1",
    name: "Geometric Vase Collection",
    price: 29.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop",
    material: "PLA",
  },
  {
    id: "2",
    name: "Custom Phone Stand",
    price: 19.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop",
    material: "ABS",
  },
];

export default function CartPage() {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 lg:mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding items to your cart
            </p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="relative w-full sm:w-20 lg:w-24 h-32 sm:h-20 lg:h-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Material: {item.material}
                          </p>
                          <p className="text-lg font-bold">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    {subtotal < 50 && (
                      <p className="text-xs text-muted-foreground">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    )}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout" className="flex items-center justify-center gap-2">
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

