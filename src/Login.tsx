import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: 'rofifhizi183@gmail.com',
    password: '123456789',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi email dan password
    if (!formData.email.trim()) {
      alert('Email tidak boleh kosong');
      return;
    }
    
    if (!formData.password.trim()) {
      alert('Password tidak boleh kosong');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Format email tidak valid');
      return;
    }

    // Simulasi login (ganti dengan API call sesuai kebutuhan)
    console.log('Login attempt:', formData);
    
    // TODO: Ganti dengan API call ke backend
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // });
    // const data = await response.json();

    // Simulasi login berhasil
    const loginSuccess = true;
    
    if (loginSuccess) {
      // Simpan data user ke localStorage (opsional)
      localStorage.setItem('user', JSON.stringify(formData));
      
      // Tampilkan pesan sukses
      alert('Login berhasil!');
      
      // Redirect ke halaman home
      navigate('/#home');
    } else {
      alert('Email atau password salah');
    }
  };

  const socialLogins = [
    { name: 'Apple', icon: '🍎' },
    { name: 'Facebook', icon: '📘' },
    { name: 'Google', icon: '🔤' },
    { name: 'Amazon', icon: '🔶' },
    { name: 'Spotify', icon: '🎵' },
    { name: 'Twitch', icon: '🎮' },
    { name: 'WeChat', icon: '💬' },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="src\assets\techgear.png"
            alt="Techgear"
            className="h-12 mx-auto mb-8"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Header Text */}
          <div className="text-center">
            <h1 className="text-white text-xl mb-2">Log in dengan ID Logi Anda.</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                ALAMAT EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder=""
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-600 py-3 focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                KATA SANDI
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder=""
                  className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-600 py-3 focus:outline-none focus:border-cyan-400 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-cyan-400 text-black font-bold py-3 rounded hover:bg-cyan-300 transition-colors uppercase tracking-wider"
            >
              Login
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="text-center text-gray-500 text-xs">
            <p>
              Situs ini dilindungi oleh hCaptcha dan berlaku{' '}
              <a href="#" className="underline hover:text-gray-400">
                Kebijakan Privasi
              </a>
              {' '}dan{' '}
              <a href="#" className="underline hover:text-gray-400">
                Ketentuan Layanannya
              </a>
              .
            </p>
          </div>

          {/* Passkey Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <a
                href="#"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                🔑 GUNAKAN KUNCI SANDI UNTUK MASUK
              </a>
              <span className="text-gray-500 text-lg cursor-help">ℹ️</span>
            </div>
            <div className="text-center">
              <a
                href="#"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                Kunci sandi hilang?
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500 uppercase text-xs tracking-widest">
                ATAU
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-4">
            <p className="text-center text-gray-400 text-sm mb-4">
              Kunci sandi hilang?
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {socialLogins.map((social) => (
                <button
                  key={social.name}
                  className="bg-white rounded-full p-3 hover:bg-gray-200 transition-colors"
                  title={social.name}
                >
                  <span className="text-xl">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center px-4">
            <button className="text-gray-600 hover:text-white transition-colors text-2xl" 
            onClick={() => navigate('/#home')}>
              ← 
            </button>
            <button className="text-gray-600 hover:text-white transition-colors text-2xl">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
