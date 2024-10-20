"use client";

import React, { useState, useEffect } from "react";
import { addUser, fetchUserInfo } from "../actions";
import {
  convertEmissionsToOffsetCost,
  convertTextAndImageCallsToEmissions,
} from "@/scripts/emissions";
import ValueCard from "@/components/ValueCard";
import { SignedOut } from "@clerk/nextjs";
import { MetroSpinner } from 'react-spinners-kit';
import { redirect } from "next/navigation";
import Link from "next/link";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"

const formSchema = z.object({
  tag: z.string().min(1, {
    message: "Tag must be at least 1 character.",
  }).regex(/^[a-zA-Z0-9-]+$/, {
    message: "Tag can only contain letters, numbers, and hyphens.",
  }),
})

export default function Page() {
  const [data, setData] = useState<{ label: string; value: number | string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const setUserInfo = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchUserInfo();
        if (result) {
          const { text_count, image_count, amount_offset } = result;
          const emissions = convertTextAndImageCallsToEmissions(text_count, image_count);
          const offsetCost = Math.max(0,convertEmissionsToOffsetCost(emissions) - amount_offset);

          const newData = [
            { label: "LLM calls", value: text_count },
            { label: "Image calls", value: image_count },
            { label: "Tons of CO2", value: emissions },
            { label: "Offset Cost", value: `$${offsetCost}` },
          ];

          setData(newData);
        } else {
          setIsNewUser(true)
        }
      } catch (err) {
        setError("Woah. Something happened");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    setUserInfo();
  }, []);

  if (error) {
    redirect('/error');
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag: "",
    },
  })

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    setLoading(true);
  
    try {
      await addUser(value.tag);
      const newData = [
        { label: "LLM calls", value: 0 },
        { label: "Image calls", value: 0 },
        { label: "Tons of CO2", value: 0 },
        { label: "Offset Cost", value: '$0' },
      ];
      setData(newData);
    } catch (error) {
      console.error("Error adding user:", error);
      setError("Failed to add user.");
    } finally {
      setIsNewUser(false);
      setLoading(false);
    }
  };

  if (isNewUser) {
    return (
      <div className="text-white h-screen relative w-full overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c8ed3e7d491e37259a30c5_Langchain-hero-1_1706794335%201-placeholder.jpg"
          >
            <source
              src="https://customer-xp1a3vy0ydc4ega7.cloudflarestream.com/bb6cf069546e3d829aa5808ac8b07748/downloads/default.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
{loading ? (
        <div className="pt-96 flex justify-center text-3xl">
          <MetroSpinner color="#fff" size={150} />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white rounded-lg px-8 py-6 text-black w-96">
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-xl">Select a Tag</FormLabel>
              <FormControl>
                <Input placeholder="Enter a tag" className="text-lg" {...field} />
              </FormControl>
              <FormDescription className="text-md font-semibold">
                This is a public-facing tag used to identify your entity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="text-lg">Submit</Button>
      </form>
    </Form>
        </div>)}
      </div>)
  }

  return (
    <div className="text-white h-screen relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c8ed3e7d491e37259a30c5_Langchain-hero-1_1706794335%201-placeholder.jpg"
        >
          <source
            src="https://customer-xp1a3vy0ydc4ega7.cloudflarestream.com/bb6cf069546e3d829aa5808ac8b07748/downloads/default.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {loading ? (
        <div className="pt-96 flex justify-center text-3xl">
          <MetroSpinner color="#fff" size={150} />
        </div>
      ) : (
        <div className="pt-24">
          <SignedOut>
            <div className="flex justify-center text-3xl font-bold">
              <h1>This is what your dashboard will look like:</h1>
            </div>
          </SignedOut>

          <div className="pt-40 flex justify-evenly">
            {data.map((item, index) => (
              <ValueCard key={index} value={item.value} description={item.label} />
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <Link
              href={`/pay/${(data.find(item => item.label === "Offset Cost")?.value as string).replace("$", "")}`}
              className="text-4xl font-bold text-white bg-gradient-to-r from-pink-600 to-blue-600 rounded-2xl py-3 px-5 transition transform hover:scale-110 duration-500"
            >
              Offset Carbon
            </Link>
          </div>

          <SignedOut>
            <div className="pt-40 flex justify-center text-3xl">
              <h1>Please sign in to view your dashboard.</h1>
            </div>
          </SignedOut>
        </div>
      )}
    </div>
  );
}
