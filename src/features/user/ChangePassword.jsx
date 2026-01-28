import {
  Form,
  Link,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import Header from '../../ui/Header';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import SuccessModal from '../../ui/SuccessModal';

export default function ChangePassword() {
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const data = useActionData();
  const message = 'Password anda berhasil diubah!';

  const isSuccess = navigation.state === 'idle' && data?.status === 'success';

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="mx-auto w-80 max-w-2xl pb-6">
      <Header name="Ubah password" />

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <Form method="PATCH" noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password sekarang
            </label>

            <div className="relative mt-1">
              <input
                type={showPasswordCurrent ? 'text' : 'password'}
                name="passwordCurrent"
                className="w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswordCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {data?.errors?.passwordCurrent && (
            <p className="-mt-3 mb-3 text-sm text-red-600">
              {data?.errors?.passwordCurrent}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password baru
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {data?.errors?.password && (
            <p className="-mt-3 mb-3 text-sm text-red-600">
              {data?.errors?.password}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi password
            </label>
            <div className="relative mt-1">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirm"
                className="w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {data?.errors?.passwordConfirm && (
            <p className="-mt-3 mb-3 text-sm text-red-600">
              {data?.errors?.passwordConfirm}
            </p>
          )}
          {data?.general && (
            <p className="-mt-3 mb-3 text-sm text-red-600">{data?.general}</p>
          )}

          <div className="flex justify-center pt-4">
            <button
              disabled={isSubmitting}
              className="rounded bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Menyimpan...' : 'Ubah password'}
            </button>
          </div>
        </Form>
        <div className="flex justify-center pt-4">
          <Link
            to="/users"
            className="rounded bg-stone-500 px-6 py-2 text-sm font-semibold text-white hover:bg-stone-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            &larr; Kembali
          </Link>
        </div>
      </div>

      <SuccessModal
        open={isSuccess}
        message={message}
        onClose={() => navigate('/users')}
      />
    </div>
  );
}

export async function action({ request }) {
  const URL = import.meta.env.BACKEND_API;
  const API_URL = URL || 'http://localhost:8000';

  const formData = await request.formData();

  const passwordCurrent = formData.get('passwordCurrent');
  const password = formData.get('password');
  const passwordConfirm = formData.get('passwordConfirm');

  const errors = {};

  if (password.length < 8) errors.password = 'Password minimal 8 karakter';
  if (passwordCurrent.length < 8)
    errors.passwordCurrent = 'Tolong masukkan password anda yang sekarang!';
  if (passwordConfirm !== password)
    errors.passwordConfirm = 'Konfirmasi password harus sama dengan password';

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      enteredValue: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    };
  }

  const payload = { passwordCurrent, password, passwordConfirm };

  const res = await fetch(`${API_URL}/users/updateMyPassword`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    return { general: data.message };
  }

  return data;
}
