import { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from 'react-router-dom';

import { isEmail, hasMinLength } from '../../utils/validation';
import backImage from '../../assets/auth-bg.png';

export default function Login() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const data = useActionData();

  const isLoading = navigation.state === 'submitting';

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
            Login
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Selamat Datang Kembali! Silahkan login akun anda
          </p>

          <Form method="POST" className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                defaultValue={data?.enteredValue?.email}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-sm text-red-600">{data?.errors?.email}</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue={data?.enteredValue?.password}
                  placeholder="••••••••"
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
              <p className="text-sm text-red-600">{data?.errors?.password}</p>
            </div>
            <p className="text-sm text-red-600">{data?.general}</p>

            <div className="flex justify-end">
              <Link
                to="/forgotPassword"
                className="text-sm text-blue-600 hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="spin" weight="bold" /> : 'Login'}
            </button>
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun?
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const URL = import.meta.env.VITE_BACKEND_API;
  const API_URL = URL || 'http://localhost:8000';

  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');

  const errors = {};

  if (!isEmail(email)) errors.email = 'Email tidak valid';
  if (!hasMinLength(password, 8))
    errors.password = 'Password minimal 8 karakter';
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      enteredValue: {
        email,
        password,
      },
    };
  }

  const userData = { email, password };

  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const error = await res.json();

  if (!res.ok) return { general: error.message || 'Email atau password salah' };

  return redirect('/dashboard');
}
