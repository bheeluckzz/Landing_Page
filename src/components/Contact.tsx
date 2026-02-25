const Contact = () => {
  return (
    <section id="contacts" className="py-20 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Contact Us
        </h3>

        <form className="grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            placeholder="Message"
            rows={5}
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="bg-primary bg-blue-400 text-black py-3 rounded hover:opacity-80">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;