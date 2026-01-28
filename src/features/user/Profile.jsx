import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import { useState } from 'react';
import { getMe, logout, updateMe } from '../../services/apiUser';
import Header from '../../ui/Header';
import { Pencil } from 'lucide-react';

const Profile = () => {
  const data = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const user = data.data.user;

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [preview, setPreview] = useState(user.photo?.url || null);

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="mx-auto w-full max-w-2xl pb-6">
      <Header name="Profile Saya" />

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <Form method="PATCH" encType="multipart/form-data" noValidate>
          <div className="mb-6 flex items-center gap-5">
            <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border">
              <img
                src={
                  preview ||
                  user.photo?.url ||
                  'https://res.cloudinary.com/dfyvkrjem/image/upload/v1767677931/000000_text_No_Image_hjjaop.png'
                }
                alt="Profile"
                className="h-full w-full object-cover"
              />

              <input
                type="file"
                accept="image/*"
                name="photo"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  // setPhoto(file);
                  setPreview(URL.createObjectURL(file));
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700">
                Foto Profil (opsional)
              </label>
              <span className="text-xs">
                klik foto profil untuk ubah, maksimal 1MB
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {actionData?.errors?.name && (
            <p className="-mt-3 mb-3 text-sm text-red-600">
              {actionData?.errors?.name}
            </p>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {actionData?.errors?.email && (
            <p className="-mt-3 mb-3 text-sm text-red-600">
              {actionData?.errors?.email}
            </p>
          )}

          <div className="flex justify-between pt-4">
            <Link
              to="/changePassword"
              className="flex items-center gap-2 rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              <Pencil className="h-4 w-4" />
              Ubah password
            </Link>
            <button
              disabled={isSubmitting}
              className="rounded bg-blue-500 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </Form>

        <div className="mt-4 flex justify-end border-t pt-4">
          <Form action="/logout" method="POST">
            <button className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60">
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

export async function loader() {
  const data = await getMe();
  return data;
}

export async function action({ request, params }) {
  const method = request.method;
  const data = await request.formData();

  if (method === 'PATCH') {
    const name = data.get('name');
    const email = data.get('email');

    const errors = {};

    if (!email) {
      errors.email = 'Email tidak boleh kosong';
    } else if (!email.includes('@')) {
      errors.email = 'Tolong masukkan email yang valid';
    }

    if (!name) errors.name = 'Nama tidak boleh kosong';

    if (Object.keys(errors).length > 0) {
      return {
        errors,
      };
    }

    const res = await updateMe(data);
    const response = res.json();

    return response;
  }

  if (method === 'POST') {
    await logout();
    return redirect('/');
  }
}
