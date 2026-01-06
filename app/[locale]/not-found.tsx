import { EgapyAnimatedLogo } from "@/components/loader/egapy-animated-logo";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="text-center p-10 bg-white  rounded-lg max-w-md w-full">
        {/* Logo Section */}
        <div className="mb-8 flex items-center justify-center">
          <EgapyAnimatedLogo className="w-64 mb-6 opacity-95" />
        </div>

        {/* Message */}
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {`
          The page you're looking for doesn't exist. But don't worry, we're here
          to help you get back on track.`}
        </p>

        {/* Navigation Button */}
        <Link
          href="/"
          className="inline-block px-8 py-4 text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg text-lg font-semibold transition duration-200 transform hover:scale-105"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
