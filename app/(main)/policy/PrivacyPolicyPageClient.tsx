"use client";

export default function PrivacyPolicyPageClient() {
  return (
    <div className="animate-fade-in">
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-burgundy-100 rounded-2xl shadow-lg p-8 md:p-12 text-burgundy-700 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-burgundy-900">Privacy Policy</h1>
            <div className="space-y-6 text-burgundy-700 leading-relaxed">
              <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
              <p>
                At ConnectCom, we respect your privacy and are committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, and safeguard your data.
              </p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">Information We Collect</h2>
              <p>We collect information that you provide directly to us when you create an account, make a purchase, or contact us.</p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">How We Use Your Information</h2>
              <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              <h2 className="text-2xl font-semibold text-burgundy-900 mt-8">Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at support@connectcom.shop</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
