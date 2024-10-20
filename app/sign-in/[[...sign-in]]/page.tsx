import { SignIn } from '@clerk/nextjs'

export default function Page() {
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
    <div className="absolute top-60 left-1/2 -translate-x-1/2 text-white text-8xl z-10 space-y-5">
  <SignIn forceRedirectUrl={'/dashboard'}/>
</div>
  </div>
    )
}