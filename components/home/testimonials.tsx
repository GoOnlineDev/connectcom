import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Customer",
    image: "/testimonials/testimonial-1.jpg",
    quote: "ConnectCom has completely changed how I shop online. The ability to interact directly with shop owners makes the experience so much more personal."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Shop Owner",
    image: "/testimonials/testimonial-2.jpg",
    quote: "As a small business owner, ConnectCom has been instrumental in growing my customer base. The platform is intuitive and the support team is always helpful."
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Customer",
    image: "/testimonials/testimonial-3.jpg",
    quote: "I've discovered so many unique products that I wouldn't have found elsewhere. The quality of shops on ConnectCom is consistently excellent."
  }
];

export default function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border-burgundy/10 animate-fade-in">
          <div className="flex items-center mb-4">
            <div className="relative w-12 h-12 mr-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-burgundy">{testimonial.name}</h3>
              <p className="text-burgundy/70 text-sm">{testimonial.role}</p>
            </div>
          </div>
          <blockquote className="text-burgundy/80 italic relative">
            <svg className="absolute -top-2 -left-2 w-8 h-8 text-burgundy/10 transform -scale-x-100" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="pl-6">{testimonial.quote}</p>
          </blockquote>
          <div className="mt-4 flex">
            {Array(5).fill(0).map((_, i) => (
              <svg 
                key={i} 
                className="w-4 h-4 text-yellow-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 