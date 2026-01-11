export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-6xl font-bold text-gray-900">
          Advuman
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Your AI Business Advisor
        </p>
        <p className="text-gray-500">
          Personalized business consulting powered by AI
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/signup"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
