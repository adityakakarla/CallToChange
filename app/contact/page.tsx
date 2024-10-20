import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Contact() {
    return (
        <div className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
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
      <div className="absolute bottom-40 left-20 text-white text-8xl z-10 space-y-5">
        <h1>Contact Us</h1>
        <h1 className="text-2xl">We love criticism.</h1>
        <h1 className="text-2xl">Reach us at adi[at]adikakarla[dot]com</h1>
        <div className="flex flex-row space-x-5 pt-10">
          <Button className="bg-white hover:bg-green-200 transition duration-300 ease-in-out text-black rounded-full py-8 px-12 text-lg" asChild>
          <a href='https://youtu.be/TMWhvw60K70'>
          View Demo
          </a>
          </Button>
          <Button className="bg-transparent border border-white text-white transition duration-300 ease-in-out hover:bg-black hover:bg-opacity-20 rounded-full py-8 px-12 text-lg">
          <Link href='/sign-up'>
          Get Started
          </Link>
          </Button>
        </div>
      </div>
    </div>
    )
}