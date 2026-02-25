const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
        
        <div>
          <h2 className="text-4xl font-bold mb-4">
            G502 HERO WIRELESS
          </h2>

          <p className="text-gray-400 mb-6">
            Logitech's High Performance Wireless Gaming Mouse
          </p>

          <p className="text-primary text-xl mb-6"><s className="text-gray-600 text-sm">USD 100.00</s> USD 99.99</p>

          <div className="flex gap-4">
            <button className="bg-primary bg-blue-400 text-black px-6 py-3 rounded hover:opacity-80">
              Add to Cart
            </button>
            <button className="border border-gray-600 px-6 py-3 rounded hover:bg-blue-400 hover:text-black transition">
              More Details
            </button>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://resource.logitech.com/w_544,h_466,ar_7:6,c_pad,q_auto,f_auto,dpr_2.0/d_transparent.gif/content/dam/gaming/en/non-braid/hyjal-g502-hero/2025/g502-hero-mouse-top-angle-gallery-1.png"
            alt="Mouse"
            className="w-full max-w-lg mx-auto"
          />
          <span className="absolute right-0 top-1/3 text-6xl font-bold text-primary opacity-20 rotate-90">
            G502
          </span>
        </div>

      </div>
    </section>
  );
};

export default Hero;