import { useState, useEffect } from 'react';
import { api } from '../../api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServices().then(setServices).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section id="services" className="py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
          We provide more than high-tech products!
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((item) => (
            <div
              key={item.id || item.title}
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
