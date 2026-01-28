import { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import {
  Form,
  Link,
  useActionData,
  redirect,
  useNavigation,
} from 'react-router-dom';

import { isEmail, hasMinLength } from '../../utils/validation';
import backImage from '../../assets/auth-bg.png';

export default function Login() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showpasswordConfirm, setShowPasswordConfirm] = useState(false);
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
            Register
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Silahkan lakukan registrasi akun!
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
                Nama
              </label>
              <input
                type="text"
                name="name"
                placeholder="Rudi"
                defaultValue={data?.enteredValue?.name}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-sm text-red-600">{data?.errors?.name}</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue={data?.enteredValue?.password}
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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  name="passwordConfirm"
                  type={showpasswordConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  defaultValue={data?.enteredValue?.passwordConfirm}
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
                {data?.errors?.passwordConfirm}
              </p>
            </div>

            <button
              className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading && <Loader className="spin" weight="bold" />}
              Register
            </button>

            {data?.status === 'fail' && (
              <p className="text-sm text-red-600">{data?.message}</p>
            )}
          </Form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const URL = import.meta.env.BACKEND_API;
  const API_URL = URL || 'http://localhost:8000';

  const formData = await request.formData();

  const email = formData.get('email');
  const name = formData.get('name');
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  let errors = {};

  if (!name) errors.name = 'Tolong masukkan nama anda';
  if (!isEmail(email)) errors.email = 'Email tidak valid';
  if (!hasMinLength(password, 8))
    errors.password = 'Password minimal 8 karakter';
  if (passwordConfirm !== password)
    errors.passwordConfirm = 'Konfirmasi Password harus sama dengan password';
  if (Object.keys(errors).length > 0) {
    return {
      errors,
      enteredValue: {
        email,
        name,
        password,
        passwordConfirm,
      },
    };
  }

  const userData = { email, name, password, passwordConfirm };

  const res = await fetch(`${API_URL}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const error = await res.json();

  if (!res.ok) return error;

  return redirect('/dashboard');
}
