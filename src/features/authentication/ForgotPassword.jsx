import { Loader } from 'lucide-react';
import {
  Form,
  Link,
  useActionData,
  useFetcher,
  useNavigation,
} from 'react-router-dom';

import backImage from '../../assets/auth-bg.png';
import SuccessModal from '../../ui/SuccessModal';

export default function ForgotPassword() {
  const fetcher = useFetcher();

  const isLoading = fetcher.state === 'submitting';

  const isSuccess =
    fetcher.state === 'idle' && fetcher.data?.status === 'success';

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
            Lupa Password
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600">
            Silahkan masukkan email anda untuk reset password
          </p>

          <fetcher.Form method="POST" className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                defaultValue={fetcher.data?.enteredValue?.email}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-sm text-red-600">
                {fetcher.data?.errors?.email}
              </p>
            </div>

            <p className="text-sm text-red-600">{fetcher.data?.general}</p>

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-500 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="spin" weight="bold" /> : 'Kirim'}
            </button>
          </fetcher.Form>

          <p className="mt-6 text-center text-sm">
            <Link
              to="/login"
              className="text-center font-medium text-blue-600 hover:underline"
            >
              &larr; Kembali
            </Link>
          </p>
        </div>
      </div>

      <SuccessModal
        forgotPassword
        open={isSuccess}
        message={fetcher.data?.message}
        onClose={() => fetcher.reset()}
      />
    </div>
  );
}

export async function action({ request, params }) {
  const URL = import.meta.env.VITE_BACKEND_API;
  const API_URL = URL || 'http://localhost:8000';

  const formData = await request.formData();

  const email = formData.get('email');

  const errors = {};

  if (!email.includes('@')) errors.email = 'Email tidak valid';

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      enteredValue: {
        email,
      },
    };
  }

  const userData = { email };

  const res = await fetch(`${API_URL}/users/forgotPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  return res.ok
    ? data
    : {
        general:
          data.message || 'Tolong masukkan email yang sudah anda daftarkan',
      };
}
