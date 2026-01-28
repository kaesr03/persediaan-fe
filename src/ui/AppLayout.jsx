import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loading from './Loading';

export default function AppLayout() {
  const { user, lowStocks } = useLoaderData();

  const isSidebarCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed,
  );
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={`flex min-h-screen w-full flex-col bg-gray-50 px-9 py-7 ${
          isSidebarCollapsed ? 'md:pl-24' : 'md:pl-72'
        }`}
      >
        <Navbar name={user.name} photo={user.photo} lowStocks={lowStocks} />
        <div>
          {isLoading && <Loading />}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export async function loader() {
  try {
    const URL = import.meta.env.VITE_BACKEND_API;

    const API_URL = URL || 'http://localhost:8000';

    const [userRes, lowStockRes] = await Promise.all([
      fetch(`${API_URL}/users/getMe`, {
        credentials: 'include',
      }),
      fetch(`${API_URL}/products/low-stock`, {
        credentials: 'include',
      }),
    ]);

    const userData = await userRes.json();
    const lowStockData = await lowStockRes.json();

    if (!userRes.ok) throw new Error(userData.message);

    return {
      user: userData.data.user,
      lowStocks: lowStockData.data.lowStock,
    };
  } catch {
    return redirect('/login');
  }
}
