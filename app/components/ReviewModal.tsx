"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createReview } from "@/lib/actions/review";

export default function ReviewModal({
  isOpen,
  onClose,
  bookingId,
  studentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  studentId: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 space-y-5 animate-in fade-in zoom-in duration-300">
        <h2 className="text-xl font-bold text-gray-800">Leave a Review</h2>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!rating) {
                toast.error("Please select a rating");
                return;
              }
              try {
                await createReview(bookingId, studentId, rating, comment);
                toast.success("Review submitted!");
                onClose();
              } catch {
                toast.error("Failed to submit review");
              }
            }}
            className="rounded-lg bg-black text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
