'use client'
import { useState, useEffect } from "react";
import { MetroSpinner } from "react-spinners-kit";
import { verifyOffset } from "@/app/actions";

export default function Page({params}: {params: {tag: string}}) {
  const [loading, setLoading] = useState(true);
  const [hasOffset, setHasOffset] = useState<boolean | null>(false);

  useEffect(() => {
    const checkOffset = async () => {
      const offset = await verifyOffset(params.tag);
      setHasOffset(offset);
      setLoading(false);
    };

    checkOffset();
  }, []);

    return(
        <div className="relative w-full h-screen">
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
          { loading ? <div className="pt-96 flex justify-center text-3xl">
          <MetroSpinner color="#fff" size={150} />
        </div>:
          <div className="flex flex-col items-center justify-center h-full">
          <div className={`w-96 rounded-2xl p-8 ${hasOffset ? 'bg-green-200' : 'bg-red-200'}`}>
              <h1 className="text-3xl">{hasOffset ? `${params.tag} has ${hasOffset ? '' : 'not'} offset their LLM-based emissions in the past 30 days.`:
              `${params.tag} does not exist in our database.`}</h1>
          </div>
        </div>

          }
          
        </div>
    )
}