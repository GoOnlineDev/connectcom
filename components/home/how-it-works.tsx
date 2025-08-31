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
      title: "Connect Directly",
      description: "Communicate with shop owners to ask questions, request custom orders, or get personalized service.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Make Secure Transactions",
      description: "Pay securely through our platform with protection for both buyers and sellers.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Receive Products",
      description: "Get your purchases delivered directly from the shops, then rate and review your experience.",
      icon: (
        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step) => (
        <div key={step.id} className="bg-white p-6 rounded-lg shadow-md border-burgundy/10 hover:border-burgundy/30 border transition-all">
          <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mb-4">
            {step.icon}
          </div>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center font-semibold mr-3">
              {step.id}
            </div>
            <h3 className="text-xl font-semibold text-burgundy">{step.title}</h3>
          </div>
          <p className="text-burgundy/80">{step.description}</p>
        </div>
      ))}
    </div>
  );
} 