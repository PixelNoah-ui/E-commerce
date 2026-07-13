import { useMemo } from "react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  type AddressDto,
} from "@/hooks/useAddresses";

export function useLatestAddress() {
  const addressesQuery = useAddresses();

  const latestAddress = useMemo<AddressDto | null>(() => {
    if (!addressesQuery.data?.length) {
      return null;
    }

    return addressesQuery.data[0];
  }, [addressesQuery.data]);

  return { ...addressesQuery, latestAddress };
}

export { useCreateAddress, useUpdateAddress };
