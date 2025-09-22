const testimonials = [
  {
    id: 1,
    name: "Amina Nansubuga",
    role: "Customer",
    quote: "ConnectCom has made shopping so easy and personal for me."
  },
  {
    id: 2,
    name: "John Okello",
    role: "Shop Owner",
    quote: "My business has grown since joining ConnectCom. Very helpful platform."
  },
  {
    id: 3,
    name: "Grace Kintu",
    role: "Customer",
    quote: "I find unique products and great shops on ConnectCom."
  }
];

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {testimonials.map(t => (
        <div key={t.id} className="p-4 border rounded">
          <div className="font-semibold">{t.name}</div>
          <div className="text-xs text-gray-500 mb-2">{t.role}</div>
          <div className="text-sm italic">{t.quote}</div>
        </div>
      ))}
    </div>
  );
}