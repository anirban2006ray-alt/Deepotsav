import Link from 'next/link'

/**
 * Custom not-found page for the frontend.
 * This renders when `notFound()` is called from any page in the (frontend) route group.
 *
 * Customize this component to match your app's design and provide helpful navigation.
 */
export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="mini-diya">
        <div className="flame">
          <span />
        </div>
        <div className="diya-bowl" />
      </div>
      <p className="eyebrow mb-6 justify-center">
        <span /> The path has gone dark
      </p>
      <h1 className="section-title">404</h1>
      <p className="mt-4 text-[#A99C89]">
        This light may have moved, but the celebration continues.
      </p>
      <Link className="button-primary mt-8" href="/">
        Return to the festival
      </Link>
    </main>
  )
}
