import { useState } from 'react';
import { api } from '../api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await api.contact(formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" className="py-20 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Contact Us
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <textarea
            placeholder="Message"
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="bg-card bg-gray-700 p-4 rounded outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary bg-blue-400 text-black py-3 rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
          {status && (
            <p className={`text-center ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Contact;
