import { SEO_TITLE } from '$/constants/seo';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <title>{SEO_TITLE.NOT_FOUND}</title>
      <h1 className="text-9xl font-extrabold text-ink">404</h1>
      <p className="text-2xl font-medium text-ink/70 mb-6">Page Not Found</p>
      <p className="text-ink/65 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-core text-bg font-medium rounded-md hover:bg-ink transition-colors"
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFoundPage;
