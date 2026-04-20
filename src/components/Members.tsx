// import { useState, useEffect } from 'react';
// import { api } from '../../api';

const Members = () => {
  const members = ["Electros", "Tech Lab", "PC Predator", "SpacePlay"];

  // TODO: Re-enable API when backend running
  // const [members, setMembers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   api.getMembers().then(setMembers).catch(console.error).finally(() => setLoading(false));
  // }, []);
  // if (loading) return <div className="py-20 text-center">Loading...</div>;

  return (
    <section id="members" className="py-20 bg-card scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-12">
          We proudly introduce our powerful members
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member}
              className="bg-dark p-8 rounded-xl hover:scale-102 hover:shadow-2xl transition-all duration-500 ease-in-out shadow-lg border border-gray-500/50"
            >
              <p className="text-lg font-semibold">{member}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Members;

