"use client";

export default function TermsOfServicePageClient() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-burgundy-100 rounded-2xl shadow-lg p-8 md:p-12 text-burgundy-700 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-burgundy-900">Terms of Service</h1>
            <div className="space-y-6 text-burgundy-700 leading-relaxed">
              <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                By using ConnectCom, you agree to these Terms of Service. Please read them carefully.
              </p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">Acceptance of Terms</h2>
              <p>By accessing and using ConnectCom, you accept and agree to be bound by these Terms of Service.</p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">User Responsibilities</h2>
              <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">Contact Us</h2>
              <p>If you have questions about these Terms, please contact us at support@connectcom.shop</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
