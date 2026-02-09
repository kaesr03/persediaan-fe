import { useSelector, useDispatch } from 'react-redux';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { setIsDarkMode, setIsSidebarCollapsed } from '../ui/uiSlice';
import Notification from './Notification';
import { useState } from 'react';

const getCloudinaryThumb = (url) => {
  if (!url) return '';
  return url.replace(
    '/upload/',
    '/upload/w_144,h_144,c_fill,g_auto,f_auto,q_auto/',
  );
};

export default function Navbar({ name, photo, lowStocks }) {
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const dispatch = useDispatch();
  const isSidebarCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed,
  );
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <div className="relative mb-7 flex w-full items-center justify-between">
      <button
        className="rounded-full bg-gray-100 px-3 py-3 hover:bg-blue-100"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="flex items-center gap-4 md:gap-5">
          <button
            className="relative"
            onClick={() => setIsOpenNotification((prev) => !prev)}
          >
            <Bell size={24} className="cursor-pointer text-gray-500" />
            {lowStocks.length > 0 && (
              <span className="absolute -top-2 -right-2 rounded-full bg-red-400 px-1.5 py-0.5 text-xs text-white">
                {lowStocks.length}
              </span>
            )}

            {isOpenNotification && (
              <div className="absolute top-7 right-0 z-50 w-72">
                <Notification lowStocks={lowStocks} />
              </div>
            )}
          </button>

          <hr className="mx-0.5 h-7 border-l border-gray-300 md:block" />

          <Link to="/users" className="flex items-center gap-3">
            <img
              src={
                getCloudinaryThumb(photo?.url) ||
                'https://dummyimage.com/400x400/e5e7eb/000000&text=No+Image'
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover md:h-10 md:w-10"
            />
            <span className="hidden font-semibold md:inline">
              {name.split(' ')[0]}
            </span>
          </Link>
        </div>

        <Link to="/users">
          <User
            className="hidden cursor-pointer text-gray-500 md:flex"
            size={24}
          />
        </Link>
      </div>
    </div>
  );
}
