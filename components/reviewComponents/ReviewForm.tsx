"use client";

import React, { useState } from "react";
import { Types } from "mongoose";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import ReviewFormStarRating from "./ReviewFormStarRating";
import { cross, whiteCross } from "@/public/svg-icons";
import { createReview, editReview } from "@/lib/actions/review.actions";
import { ReviewDocument } from "@/lib/interfaces";

interface ReviewFormProps {
  setShowReviewScreen: (value: boolean) => void;
  data: CarData;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  setShowReviewScreen,
  data,
}) => {
  console.log(data);
  const { theme } = useTheme();
  const [starRating, setStarRating] = useState<number | null>(null);
  const [animateClose, setAnimateClose] = useState(false);

  const handleBackgroundClick = () => {
    setAnimateClose(true);
    setTimeout(() => {
      setShowReviewScreen(false);
    }, 250);
  };

  const handleChildClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  const formSchema = z.object({
    review: z
      .string()
      .min(10, "Review must be at least 10 characters.")
      .max(300, "Review must be at most 300 characters."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      review: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const reviewObject: ReviewDocument = {
      _id: data?._id,
      userId: data?.userId,
      carId: data.carId,
      rating: starRating || 0,
      title: data.title,
      content: values.review,
      datePosted: new Date(),
    };
    editReview(reviewObject);
    console.log(values.review);
    console.log(starRating);
  }

  return (
    <motion.div
      animate={{ scale: animateClose ? 0 : 1 }}
      initial={{ scale: 0 }}
      className="fixed inset-0 z-50 flex justify-center"
      onClick={handleBackgroundClick}
    >
      <div
        onClick={handleChildClick}
        className="fixed top-44 z-50 flex max-h-[40rem] w-full max-w-[30rem] flex-col overflow-y-auto rounded-xl bg-white200 p-5 dark:bg-gray850  "
      >
        <div className="flex w-full justify-between">
          <p className="text-2xl font-semibold ">{data.brand}</p>
          <Image
            src={theme === "light" ? cross : whiteCross}
            height={30}
            width={30}
            alt="close modal"
            onClick={handleBackgroundClick}
            className="cursor-pointer self-start dark:text-white200"
          />
        </div>
        {data?.carId.carImages[0] && (
          <Image
            src={data?.carId.carImages[0]}
            alt="car-picture"
            style={{
              objectFit: "cover",
            }}
            className="mt-3 h-full w-full rounded-xl"
          />
        )}

        <ReviewFormStarRating setStarRating={setStarRating} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-5"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <p className="text-xl">Review</p>
                  <FormControl>
                    <Input
                      placeholder="Type your review here"
                      {...field}
                      autoComplete="off"
                      className="bg-white dark:bg-gray800 dark:placeholder:text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              className="mt-4 rounded bg-blue500 px-4 py-2 font-semibold text-white"
              type="submit"
            >
              Submit
            </button>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

export default ReviewForm;
