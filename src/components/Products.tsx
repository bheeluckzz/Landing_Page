const gamingImg = new URL('../assets/gaming.webp', import.meta.url).href;
const designImg = new URL('../assets/design.webp', import.meta.url).href;
const officeImg = new URL('../assets/office.webp', import.meta.url).href;

// import { useState, useEffect } from 'react';
// import { api } from '../../api';

const Products = () => {
  const products = [
    { title: "Gaming", img: gamingImg },
    { title: "Graphic Design", img: designImg },
    { title: "Office & Others", img: officeImg },
  ];

  // TODO: Re-enable API when backend running
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   api.getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  // }, []);
  // if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section id="products" className="py-20 bg-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
          Which type of gear are you looking for?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((item) => (
            <div
              key={item.title}
              className="bg-dark p-8 rounded-xl hover:scale-102 hover:shadow-2xl transition-all duration-500 ease-in-out shadow-lg border border-gray-500/50 flex flex-col items-center min-h-[200px]"
            >

              <img
                src={item.img}
                alt={item.title}
                className="w-48 h-48 mx-auto mb-6 object-cover rounded-xl"
                loading="lazy"
                onError={(e) => {
                  console.error(`Failed to load image: ${item.img}`);
                  (e.target as HTMLImageElement).src = '/vite.svg'; // fallback
                }}
              />

              <h4 className="text-lg font-semibold">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;

