"use client";

import React, { useState, useEffect } from "react";
import { fetchUserInfo } from "../actions";
import {
    convertEmissionsToOffsetCost,
    convertTextAndImageCallsToEmissions,
} from "@/scripts/emissions";
import ValueCard from "@/components/ValueCard";
import { SignedOut } from "@clerk/nextjs";
import { MetroSpinner } from 'react-spinners-kit'
import { redirect } from "next/navigation";

export default function Page() {
    const [textCalls, setTextCalls] = useState(0);
    const [imageCalls, setImageCalls] = useState(0);
    const [emissions, setEmissions] = useState(0);
    const [offsetCost, setOffsetCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function setUserInfo() {
            setLoading(true);
            try {
                setError("");
                const result = await fetchUserInfo();
                if (result) {
                    const textCalls = result.text_count;
                    const imageCalls = result.image_count;
                    const emissions = convertTextAndImageCallsToEmissions(
                        textCalls,
                        imageCalls,
                    );
                    const offsetCost = convertEmissionsToOffsetCost(emissions);
                    setTextCalls(textCalls);
                    setImageCalls(imageCalls);
                    setEmissions(emissions);
                    setOffsetCost(offsetCost);
                }
            } catch (error) {
                setError("Woah. Something happened");
                console.error(error);
            }

            setLoading(false);
        }

        setUserInfo();
    }, []);

    if (error) {
        redirect('/error')
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
            {
  loading ? (
    <div className="pt-96 text-white flex justify-center text-3xl">
      <MetroSpinner color={'#fff'} size={150} />
    </div>
  ) : (
    <div>
      <div className="pt-24">
        <SignedOut>
        <div className="text-white flex justify-center text-3xl font-bold">
          <h1>This is what your dashboard will look like:</h1>
        </div>
        </SignedOut>
        

        <div className="pt-40 flex flex-row justify-evenly">
          <ValueCard value={textCalls} description="LLM calls" />
          <ValueCard value={imageCalls} description="Image calls" />
          <ValueCard value={emissions} description="Tons of CO2" />
          <ValueCard value={`$${offsetCost}`} description="Offset Cost" />
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="https://cotap.org/donate/"
            className="inline-block text-4xl font-bold text-white bg-gradient-to-r from-pink-600 to-blue-600 rounded-2xl py-3 px-5 transition ease-in-out hover:scale-110 duration-500"
          >
            Offset Carbon
          </a>
        </div>
      </div>

      <SignedOut>
        <div className="pt-40 text-white flex justify-center text-3xl">
          <h1>Please sign in to view your dashboard.</h1>
        </div>
      </SignedOut>
    </div>
  )
}

        </div>
    );
}
