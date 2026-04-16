export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="mb-12 space-y-4">
          <p className="text-sm text-primary uppercase tracking-[0.3em] font-semibold">
            Privacy Policy
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">
            Data Privacy for Owners
          </h1>
          <p className="text-lg text-slate-600 leading-8">
            Abdu Electronics is committed to safeguarding owner data, using it
            responsibly, and empowering owners with transparency over how their
            information is handled.
          </p>
        </div>

        <section className="space-y-10">
          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p className="text-slate-600 leading-7">
              We collect information you provide when registering, listing
              products, or communicating with buyers. This includes contact
              details, business information, product descriptions, and
              transaction history.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Owner Data
            </h2>
            <ul className="space-y-3 text-slate-600 leading-7 list-disc list-inside">
              <li>To manage your account and marketplace listings.</li>
              <li>To process orders, payments, and customer inquiries.</li>
              <li>
                To improve platform features, recommendations, and owner tools.
              </li>
              <li>To protect the marketplace from abuse and fraud.</li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
            <p className="text-slate-600 leading-7">
              We may share necessary data with payment processors, delivery
              partners, and legal authorities when required to fulfill orders,
              comply with law, or protect owner rights. We do not sell your
              personal information to third parties.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              4. Security Measures
            </h2>
            <p className="text-slate-600 leading-7">
              Your account security is a priority. We use industry-standard
              security practices to protect stored data and help owners keep
              login credentials safe. Always use a strong password and verify
              account activity regularly.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">5. Owner Rights</h2>
            <ul className="space-y-3 text-slate-600 leading-7 list-disc list-inside">
              <li>
                Access your account and update your business or contact
                information.
              </li>
              <li>Review your transaction and listing history.</li>
              <li>Request corrections or deletion of data where applicable.</li>
            </ul>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">
              6. Cookies and Analytics
            </h2>
            <p className="text-slate-600 leading-7">
              We use cookies and analytics tools to provide a better experience,
              monitor performance, and understand how owners use the platform.
              These tools help us improve the marketplace and keep it reliable.
            </p>
          </article>

          <article className="rounded-3xl bg-white p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-4">7. Policy Updates</h2>
            <p className="text-slate-600 leading-7">
              This privacy policy may be updated as our services evolve. Owners
              will be notified when significant changes occur, and continued use
              of the platform means acceptance of the revised policy.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
