"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OrdersTab() {
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-slate-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Orders</CardTitle>
        {orders.length > 5 && (
          <Link href="/orders">
            <Button size="sm" variant="outline">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-600 mb-4">No orders yet</p>
            <Link href="/electronics">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <div className="p-4 rounded-lg border border-slate-200 hover:border-primary hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ETB {Number(order.total).toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          order.status === "DELIVERED"
                            ? "default"
                            : order.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
