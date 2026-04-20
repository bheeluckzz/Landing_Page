import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email tidak boleh kosong');
      return false;
    }
    
    if (!formData.password.trim()) {
      setError('Password tidak boleh kosong');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }

    if (!isLogin && formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      let response;
      if (isLogin) {
        response = await api.login({ email: formData.email, password: formData.password });
      } else {
        response = await api.register({ email: formData.email, password: formData.password });
        alert('Registrasi berhasil! Silakan login.');
        setIsLogin(true);
        setFormData({ email: '', password: '', confirmPassword: '' });
        return;
      }

      localStorage.setItem('token', response.token || '');
      localStorage.setItem('user', JSON.stringify(response.user));
      alert('Login berhasil!');
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Operasi gagal');
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="src/assets/techgear.webp"
            alt="Techgear"
            className="h-12 mx-auto mb-8"
          />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Tab Buttons */}
          <div className="flex bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${
                isLogin
                  ? 'bg-cyan-400 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all ${
                !isLogin
                  ? 'bg-cyan-400 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Header Text */}
          <div className="text-center">
            <h1 className="text-white text-xl mb-2">
              {isLogin ? 'Log in dengan ID Login Anda.' : 'Buat akun baru'}
            </h1>
            <p className="text-gray-400 text-sm">
              {isLogin ? 'Masukkan email dan kata sandi Anda.' : 'Daftar dengan email Anda.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-3 tracking-wider">
                  KONFIRMASI KATA SANDI
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={handleInputChange}
                    placeholder=""
                    className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-600 py-3 focus:outline-none focus:border-cyan-400 transition-colors pr-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <a
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Lupa kata sandi?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-cyan-400 text-black font-bold py-3 rounded hover:bg-cyan-300 transition-colors uppercase tracking-wider"
            >
              {isLogin ? 'Login' : 'Daftar'}
            </button>
          </form>

          {/* Other sections (privacy, passkey, social) */}
          <div className="space-y-4 text-center">
            {/* Privacy */}
            <div className="text-gray-500 text-xs">
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
            <div>
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
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center px-4">
            <button 
              className="text-gray-600 hover:text-white transition-colors text-2xl" 
              onClick={() => navigate('/')}
            >
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
