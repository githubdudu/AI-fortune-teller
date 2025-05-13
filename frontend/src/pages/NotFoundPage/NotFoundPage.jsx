function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
      <p className="text-2xl font-medium text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-pink-500 text-white font-medium rounded-md hover:bg-pink-600 transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFoundPage;
