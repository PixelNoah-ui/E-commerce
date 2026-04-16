import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="mb-12 space-y-4">
          <p className="text-sm text-primary uppercase tracking-[0.3em] font-semibold">
            Terms of Service
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">
            Marketplace Terms for Owners
          </h1>
          <p className="text-lg text-slate-600 leading-8">
            These terms describe how Abdu Electronics operates, how owners list
            products, and how we protect the interests of both sellers and
            buyers.
          </p>
        </div>

        <section className="space-y-10">
          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">1. Platform Scope</h2>
            <p className="text-slate-600 leading-7">
              Abdu Electronics provides an online marketplace for electronics
              owners and businesses to list, promote, and sell products across
              Ethiopia. By using the platform, owners agree to follow these
              terms, keep all information accurate, and maintain professional
              conduct with buyers.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              2. Owner Responsibilities
            </h2>
            <ul className="space-y-3 text-slate-600 leading-7 list-disc list-inside">
              <li>
                Provide accurate product details, pricing, availability, and
                delivery terms.
              </li>
              <li>
                Respond promptly to buyer inquiries and manage orders
                professionally.
              </li>
              <li>
                Ensure all listings comply with local laws and platform
                policies.
              </li>
              <li>
                Maintain account security, including strong passwords and
                contact information.
              </li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              3. Payments and Fees
            </h2>
            <p className="text-slate-600 leading-7">
              Owners are responsible for any applicable service fees or
              commissions disclosed at checkout. Our marketplace enables
              transparent settlement workflows and provides owners with clear
              payment details for each completed transaction.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              4. Product Quality & Dispute Support
            </h2>
            <p className="text-slate-600 leading-7">
              Owners must deliver products as described. Abdu Electronics
              supports dispute resolution between buyers and owners and may step
              in when a listing violates platform standards or buyer protection
              guidelines.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">5. Owner Benefits</h2>
            <ul className="space-y-3 text-slate-600 leading-7 list-disc list-inside">
              <li>Access to a trusted marketplace audience across Ethiopia.</li>
              <li>Control over product listings, categories, and pricing.</li>
              <li>
                Support services for safe communication and order management.
              </li>
              <li>
                Data-driven insights from your product performance and customer
                interest.
              </li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              6. Liability and Limitations
            </h2>
            <p className="text-slate-600 leading-7">
              Abdu Electronics is not responsible for the content of third-party
              listings or for losses caused by product misrepresentation. We
              limit our liability to the extent permitted by law and encourage
              owners to maintain accurate descriptions and good customer
              service.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-slate-600 leading-7">
              These terms may be updated periodically. Owners will be notified
              of material changes, and continued use of the service constitutes
              acceptance of the revised terms.
            </p>
          </article>
        </section>

        <div className="mt-16 rounded-3xl bg-slate-900 text-white p-10">
          <h3 className="text-2xl font-semibold mb-4">Need support?</h3>
          <p className="text-slate-300 leading-7 mb-4">
            If you are an owner and need help with listings, payments, or policy
            questions, contact our support team for fast, reliable assistance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
