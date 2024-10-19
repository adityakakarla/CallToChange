export default function ValueCard({ value, description }: { value: number | string, description: string }) {
    return (
      <div className="p-5 m-2 bg-gray-100 shadow-md rounded-lg flex flex-col items-center justify-center min-w-64 min-h-56 transition ease-in-out hover:scale-110 duration-500">
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500">
          {value.toLocaleString()}
        </div>
        <div className="mt-2 text-2xl text-gray-600 font-semibold">{description}</div>
      </div>
    );
  }