const products = [
  { title: "Gaming", img: "src/assets/gaming.png" },
  { title: "Graphic Design", img: "src/assets/design.png" },
  { title: "Office & Others", img: "src/assets/office.png" },
];

const Products = () => {
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
              className="bg-dark p-8 rounded-xl hover:scale-105 transition"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-32 mx-auto mb-6"
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