const testimonials = [
  {
    id: 1,
    name: "Amina Nansubuga",
    role: "Customer",
    quote: "ConnectCom has made shopping so easy and personal for me. I love being able to connect directly with shop owners!"
  },
  {
    id: 2,
    name: "John Okello",
    role: "Shop Owner",
    quote: "My business has grown since joining ConnectCom. The platform is very helpful and easy to use for managing my shop."
  },
  {
    id: 3,
    name: "Grace Kintu",
    role: "Customer",
    quote: "I find unique products and great shops on ConnectCom. Highly recommend to anyone looking for quality local businesses."
  },
  {
    id: 4,
    name: "David Ssemwogerere",
    role: "Shop Owner",
    quote: "The platform makes it easy to showcase my products and connect with customers. Business has been great!"
  }
];

export default function Testimonials() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {testimonials.map(t => (
        <div key={t.id} className="bg-white p-4 md:p-5 rounded-lg shadow-sm border border-burgundy-200 hover:shadow-md hover:border-burgundy-300 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-burgundy-700 font-semibold text-sm md:text-base">
                {t.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm md:text-base text-burgundy-900 line-clamp-1">{t.name}</div>
              <div className="text-xs text-burgundy-600">{t.role}</div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-burgundy-700 italic line-clamp-4">"{t.quote}"</div>
        </div>
      ))}
    </div>
  );
}