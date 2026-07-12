"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview, useReviews } from "@/hooks/useReviews";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductReviews({ productId }: { productId: string }) {
  const router = useRouter();
  const { data: reviews = [], isLoading } = useReviews(productId);
  const createReview = useCreateReview(productId);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const submit = async () => {
    try {
      await createReview.mutateAsync({ rating, title, comment });
      toast.success("Review published");
      setTitle("");
      setComment("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save review",
      );
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Leave a review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`rounded-full px-3 py-1 text-sm ${rating >= value ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {value}★
              </button>
            ))}
          </div>
          <Input
            placeholder="Review title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your experience"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button onClick={submit} disabled={createReview.isPending}>
            Publish review
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? <div>Loading reviews...</div> : null}
          {!isLoading && reviews.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No reviews yet. Be the first to share your experience.
            </div>
          ) : null}
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{review.user.fullName}</p>
                <span className="text-sm text-primary">{review.rating}★</span>
              </div>
              {review.title ? (
                <p className="mt-2 font-medium">{review.title}</p>
              ) : null}
              {review.comment ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.comment}
                </p>
              ) : null}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
