import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { Eye, EyeOff, LogOut } from 'lucide-react';

interface ProfileData {
  id: number;
  email: string;
  created: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    // Set initial user from localStorage
    setProfile(JSON.parse(storedUser));

    // Fetch fresh profile
    api.profile(token)
      .then(data => setProfile(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Error: {error || 'Profile not found'}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-cyan-400 text-black px-6 py-2 rounded hover:bg-cyan-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <img
            src="/src/assets/techgear.webp"
            alt="Techgear"
            className="h-12 mx-auto mb-6"
          />
          <h1 className="text-white text-2xl font-bold mb-2">Profile</h1>
          <p className="text-gray-400">Kelola akun Anda</p>
        </div>

        {/* Profile Info Card */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 tracking-wider uppercase">
                Email
              </label>
              <div className="text-white font-medium bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
                {profile.email}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 tracking-wider uppercase">
                Bergabung
              </label>
              <div className="text-gray-300 bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600">
                {new Date(profile.created).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit' 
                })}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-2 tracking-wider uppercase">
                Token (24 jam)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  readOnly
                  value={localStorage.getItem('token') || ''}
                  className="w-full bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-600 text-white pr-10 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/80 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl border border-red-500/50 transition-all duration-200 flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
        >
          <LogOut size={20} />
          Logout
        </button>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 px-4">
          <button 
            className="text-gray-600 hover:text-white text-2xl" 
            onClick={() => navigate('/')}
          >
            ← Home
          </button>
          <button 
            className="text-gray-600 hover:text-white text-2xl" 
            onClick={() => navigate('/login')}
          >
            Login →
          </button>
        </div>
      </div>
    </div>
  );
}
