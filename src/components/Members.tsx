const members = ["Electros", "Tech Lab", "PC Predator", "SpacePlay"];

const Members = () => {
  return (
    <section id="members" className="py-20 bg-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
          We proudly introduce our powerful members
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          {members.map((name) => (
            <div
              key={name}
              className="bg-dark p-8 rounded-xl hover:scale-105 border border-gray-500 transition"
            >
              <p className="text-lg font-semibold">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Members;