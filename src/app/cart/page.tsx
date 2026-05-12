"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, UtensilsCrossed, Bike, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createOrder } from "@/app/actions/order";
import OrderTimeEstimator from "@/components/OrderTimeEstimator";
import DiscountPopup from "@/components/DiscountPopup";
import { calculateEstimatedTime, type OrderType } from "@/lib/orderTimePrediction";

const orderSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Full address is required"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

const ORDER_TYPES: { value: OrderType; label: string; icon: React.ReactNode }[] = [
  { value: "Delivery", label: "Delivery", icon: <Bike size={15} /> },
  { value: "Takeaway", label: "Takeaway", icon: <Package size={15} /> },
  { value: "Dine-in", label: "Dine-in", icon: <UtensilsCrossed size={15} /> },
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart, deliveryInfo } = useCart();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>("Delivery");
  const [deliveryZone, setDeliveryZone] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
  });

  useEffect(() => {
    if (session?.user) {
      setValue("customerName", deliveryInfo.customerName || session.user.name || "");
    }
    if (deliveryInfo.phone) setValue("phone", deliveryInfo.phone);
    if (deliveryInfo.address) setValue("address", deliveryInfo.address);
  }, [session, deliveryInfo, setValue]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute estimate for discount popup
  const estimate = useMemo(
    () =>
      calculateEstimatedTime(
        items.map((i) => ({ id: i.id, quantity: i.quantity })),
        orderType,
        deliveryZone
      ),
    [items, orderType, deliveryZone]
  );

  if (!mounted) return null;

  const total = getTotal();
  const deliveryFee = orderType === "Delivery" ? 1 : 0;

  const onOrderSubmit = async (data: OrderFormValues) => {
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        ...data,
        orderType,
        totalAmount: total + deliveryFee,
        items: items,
        userId: session?.user?.id,
        estimatedMins: estimate.maxMins,
      });

      if (result.success) {
        // Persist estimate for the confirmation/tracker page
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "lixor-last-order",
            JSON.stringify({
              orderId: result.orderId,
              orderType,
              estimatedMins: estimate.maxMins,
              placedAt: Date.now(),
            })
          );
        }
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/confirmation");
      } else {
        console.error("Order failed:", result.error);
        toast.error(result.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order exception:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      {/* Discount popup — fires when estimated wait > 30 mins */}
      <DiscountPopup estimatedMins={estimate.maxMins} />

      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-12"
        >
          {/* ── Cart Items ── */}
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-medium text-[#1A1A1A] mb-8 flex items-center gap-4">
              Your Bag
              <span className="text-lg font-sans text-[#999] font-normal">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            </h1>

            {items.length === 0 ? (
              <div className="py-20 text-center bg-neutral-50 rounded-[32px] border border-dashed border-neutral-200">
                <ShoppingBag className="mx-auto w-12 h-12 text-neutral-300 mb-4" />
                <p className="text-neutral-500 font-sans mb-8">
                  Your bag is empty. Time to add some delicious food!
                </p>
                <Link
                  href="/menu"
                  className="bg-[#FF5C00] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-500/20"
                >
                  Explore Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-6 p-4 bg-white border border-neutral-100 rounded-[24px] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 rounded-[18px] overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-[#1A1A1A]">{item.name}</h3>
                        <p className="text-[#FF5C00] font-sans font-bold text-sm">
                          $ {item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 bg-neutral-50 rounded-full px-3 py-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:text-[#FF5C00] transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-sans font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-[#FF5C00] transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── Checkout Sidebar ── */}
          <div className="w-full md:w-[400px]">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-[32px] shadow-2xl sticky top-32 space-y-6">
              <h2 className="text-2xl font-serif">Order Summary</h2>

              {/* Order type selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Order Type
                </label>
                <div className="flex gap-2">
                  {ORDER_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setOrderType(t.value)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        orderType === t.value
                          ? "bg-[#FF5C00] border-[#FF5C00] text-white"
                          : "bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time estimator — only when cart has items */}
              {items.length > 0 && (
                <OrderTimeEstimator
                  items={items}
                  orderType={orderType}
                  deliveryZone={deliveryZone}
                  onDeliveryZoneChange={setDeliveryZone}
                />
              )}

              {/* Price breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-neutral-400 font-sans text-sm">
                  <span>Subtotal</span>
                  <span>$ {total.toLocaleString()}</span>
                </div>
                {orderType === "Delivery" && (
                  <div className="flex justify-between text-neutral-400 font-sans text-sm">
                    <span>Delivery Fee</span>
                    <span>$ 1</span>
                  </div>
                )}
                <div className="h-[1px] bg-white/10" />
                <div className="flex justify-between text-xl font-sans font-bold">
                  <span>Total</span>
                  <span className="text-[#FF5C00]">
                    $ {(total + (items.length > 0 ? deliveryFee : 0)).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout form */}
              {items.length > 0 && (
                <form onSubmit={handleSubmit(onOrderSubmit)} className="space-y-4">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest block">
                    {orderType === "Dine-in" ? "Your Info" : "Delivery Info"}
                  </label>

                  <div className="space-y-1">
                    <input
                      {...register("customerName")}
                      placeholder="Full Name"
                      className={`w-full bg-white/5 border ${
                        errors.customerName ? "border-red-500" : "border-white/10"
                      } rounded-xl px-4 py-3 text-sm focus:border-[#FF5C00] outline-none transition-colors`}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-[10px]">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      {...register("phone")}
                      placeholder="Phone Number"
                      className={`w-full bg-white/5 border ${
                        errors.phone ? "border-red-500" : "border-white/10"
                      } rounded-xl px-4 py-3 text-sm focus:border-[#FF5C00] outline-none transition-colors`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-[10px]">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <textarea
                      {...register("address")}
                      placeholder={
                        orderType === "Dine-in"
                          ? "Table number or special request"
                          : "Delivery Address"
                      }
                      className={`w-full bg-white/5 border ${
                        errors.address ? "border-red-500" : "border-white/10"
                      } rounded-xl px-4 py-3 text-sm focus:border-[#FF5C00] outline-none transition-colors h-24 resize-none`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-[10px]">{errors.address.message}</p>
                    )}
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full bg-[#FF5C00] hover:bg-[#E65200] disabled:bg-neutral-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSubmitting ? "Placing Order..." : "Confirm Order"}
                    {!isSubmitting && (
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    )}
                  </button>
                  <p className="text-center text-[10px] text-neutral-500">
                    CASH ON DELIVERY ONLY
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
