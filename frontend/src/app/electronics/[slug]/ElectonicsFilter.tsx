"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortType } from "@/types/Types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";

interface RentalsFiltersLayoutProps {
  children: React.ReactNode;
}

export default function RentalsFiltersLayout({
  children,
}: RentalsFiltersLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pathname = usePathname();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    price_min: searchParams.get("price_min") || undefined,
    price_max: searchParams.get("price_max") || undefined,
    sort: searchParams.get("sort") || "last_updated",
  });

  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`${pathname}?${newSearchParams.toString()}`);
    });
  }

  return (
    <main className="group flex flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:items-start">
      <aside
        className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-74"
        data-pending={isPending ? "" : undefined}
      >
        <PriceFilter
          minDefaultInput={optimisticFilters.price_min}
          maxDefaultInput={optimisticFilters.price_max}
          updatePriceRange={(priceMin, priceMax) =>
            updateFilters({
              price_min: priceMin,
              price_max: priceMax,
            })
          }
        />
      </aside>

      <div className="w-full max-w-7xl space-y-5 group-has-[[data-pending]]:animate-pulse">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.sort}
            updateSort={(sort) => updateFilters({ sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
}

interface PriceFilterProps {
  minDefaultInput: string | undefined;
  maxDefaultInput: string | undefined;
  updatePriceRange: (min: string | undefined, max: string | undefined) => void;
}

function PriceFilter({
  minDefaultInput,
  maxDefaultInput,
  updatePriceRange,
}: PriceFilterProps) {
  const [minInput, setMinInput] = useState(() => minDefaultInput || "");
  const [maxInput, setMaxInput] = useState(() => maxDefaultInput || "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRange(minInput, maxInput);
  }

  return (
    <div className="space-y-3 rounded border border-gray-200 bg-white p-5 text-black">
      <div className="font-bold">Price range</div>
      <form className="flex items-center gap-2" onSubmit={onSubmit}>
        <Input
          type="number"
          name="min"
          placeholder="Min"
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          className="w-30 text-black"
        />
        <span>-</span>
        <Input
          type="number"
          name="max"
          placeholder="Max"
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          className="w-30 rounded-none text-black"
        />
        <Button type="submit" className="w-20 rounded-none">
          Go
        </Button>
      </form>
      {(!!minDefaultInput || !!maxDefaultInput) && (
        <button
          onClick={() => updatePriceRange(undefined, undefined)}
          className="text-sm text-primary hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (value: sortType) => void;
}

function SortFilter({ sort, updateSort }: SortFilterProps) {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-2 text-start rounded-none bg-white text-black border border-gray-300 hover:bg-gray-50">
        <span className="text-black">
          Sort by: <SelectValue className="text-black" />
        </span>
      </SelectTrigger>
      <SelectContent className="rounded-none bg-white text-black">
        <SelectItem
          value="last_updated"
          className="text-black hover:bg-gray-100"
        >
          Newest
        </SelectItem>
        <SelectItem value="price_asc" className="text-black hover:bg-gray-100">
          Price (Low to high)
        </SelectItem>
        <SelectItem value="price_desc" className="text-black hover:bg-gray-100">
          Price (High to low)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
