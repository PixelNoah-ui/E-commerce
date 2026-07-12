import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildApiUrl } from "@/lib/auth";

export type ReviewDto = {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user: { id: string; fullName: string; imageUrl: string | null };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(buildApiUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function useReviews(productId?: string) {
  return useQuery<ReviewDto[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) return [];
      const data = await request<{ data: { reviews: ReviewDto[] } }>(
        `/customer/products/${productId}/reviews`,
      );
      return data.data.reviews;
    },
    enabled: Boolean(productId),
  });
}

export function useCreateReview(productId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      rating: number;
      title?: string;
      comment?: string;
    }) =>
      request<{ data: { review: ReviewDto } }>(
        `/customer/products/${productId}/reviews`,
        { method: "POST", body: JSON.stringify(payload) },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
}
