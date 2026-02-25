const services = [
  { title: "Lifetime Guarantee", desc: "High quality products guaranteed." },
  { title: "Good Price", desc: "Best value for premium devices." },
  { title: "Free Software Updates", desc: "Lifetime update support." },
  { title: "24/7 Support", desc: "We are always here to help." },
];

const Services = () => {
  return (
    <section id="services" className="py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
          We provide more than high-tech products!
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((item) => (
            <div
              key={item.title}
              className="bg-card p-8 rounded-xl text-left hover:border-primary border border-gray-500 transition"
            >
              <h4 className="text-xl font-semibold mb-4 text-primary">
                {item.title}
              </h4>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;