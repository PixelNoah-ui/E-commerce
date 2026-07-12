"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package } from "lucide-react";
import AddressesTab from "./AddressesTab";
import OrdersTab from "./OrdersTab";

interface AccountTabsProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    imageUrl?: string | null;
  };
}

export default function AccountTabs({ user }: AccountTabsProps) {
  const searchParams = useSearchParams();
  const validTabs = ["addresses", "orders"];
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(initialTab || "") ? initialTab! : "addresses",
  );

  const tabs = [
    {
      id: "addresses",
      label: "Address",
      icon: MapPin,
      component: <AddressesTab />,
    },
    {
      id: "orders",
      label: "Orders",
      icon: Package,
      component: <OrdersTab />,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Tabs List */}
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-transparent p-0 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 px-3 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              <Icon size={16} />
              <span className="hidden sm:inline text-sm font-medium">
                {tab.label}
              </span>
              <span className="sm:hidden text-xs">
                {tab.label.substring(0, 1)}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tabs Content */}
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
