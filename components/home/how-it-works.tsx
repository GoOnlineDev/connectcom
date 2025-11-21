export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Browse Shops",
      description: "Explore our curated selection of independent shops and businesses across multiple categories.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Add to Cart",
      description: "Select products or services you like and add them to your cart. Save favorites to your wishlist for later.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Place Your Order",
      description: "Complete checkout with your delivery information. Shop owners will contact you to confirm and arrange payment.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Connect with Shops",
      description: "Use the shop contact information to reach out directly via phone, email, or WhatsApp for questions or custom requests.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {steps.map((step) => (
        <div key={step.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-burgundy-200 hover:border-burgundy-300 hover:shadow-md transition-all">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-burgundy-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
                {step.id}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-burgundy-900 mb-1 line-clamp-1">{step.title}</h3>
              <p className="text-xs md:text-sm text-burgundy-700 line-clamp-3">{step.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 