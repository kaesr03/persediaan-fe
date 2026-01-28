import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useFetcher, useNavigate } from 'react-router-dom';

import { hasMinLength } from '../../utils/validation';
import backImage from '../../assets/auth-bg.png';
import SuccessModal from '../../ui/SuccessModal';

export default function Login() {
  const fetcher = useFetcher();
  const [showPassword, setShowPassword] = useState(false);
  const [showpasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const isLoading = fetcher.state === 'submitting';
  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${backImage})`,
        backgroundSize: '600px',
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Reset Password
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Silahkan masukkan password baru anda!
          </p>

          <fetcher.Form method="POST" className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password Baru
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue={fetcher.data?.enteredValue?.password}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-sm text-red-600">
                {fetcher.data?.errors?.password}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  name="passwordConfirm"
                  type={showpasswordConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue={fetcher.data?.enteredValue?.passwordConfirm}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showpasswordConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showpasswordConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <p className="text-sm text-red-600">
                {fetcher.data?.errors?.passwordConfirm}
              </p>
            </div>

            <button
              className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading && <Loader className="spin" weight="bold" />}
              Submit
            </button>

            {fetcher.data?.status === 'fail' && (
              <p className="text-sm text-red-600">{fetcher.data?.message}</p>
            )}
          </fetcher.Form>

          <p className="mt-6 text-center text-sm text-gray-600"></p>
        </div>
      </div>

      <SuccessModal
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => navigate('/login')}
      />
    </div>
  );
}

export async function action({ request, params }) {
  const URL = import.meta.env.VITE_BACKEND_API;
  const API_URL = URL || 'http://localhost:8000';

  const token = params.token;
  const formData = await request.formData();

  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  let errors = {};

  if (!hasMinLength(password, 8))
    errors.password = 'Password minimal 8 karakter';
  if (passwordConfirm !== password)
    errors.passwordConfirm = 'Konfirmasi Password harus sama dengan password';
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      enteredValue: {
        password,
        passwordConfirm,
      },
    };
  }

  const userData = { password, passwordConfirm };

  const res = await fetch(`${API_URL}/users/resetPassword/${token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  return data;
}
