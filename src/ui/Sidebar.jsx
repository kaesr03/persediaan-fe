import { NavLink } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { setIsSidebarCollapsed } from '../ui/uiSlice';
import {
  Archive,
  CircleDollarSign,
  FilePlus,
  Layers,
  Layout,
  Menu,
  Package,
  Tags,
  Truck,
  User,
} from 'lucide-react';

import logo from '../assets/logoD.png';

function SidebarLink({ href, icon: Icon, label, isCollapsed }) {
  return (
    <NavLink to={href}>
      {({ isActive }) => (
        <div
          className={`flex cursor-pointer items-center gap-3 ${isCollapsed ? 'justify-center py-4' : 'justify-start px-8 py-4'} hover:bg-blue-100 hover:text-blue-500 ${isActive ? 'bg-blue-200 text-black' : ''} `}
        >
          <Icon className="h-6 w-6" />
          {!isCollapsed && <span className="font-medium">{label}</span>}
        </div>
      )}
    </NavLink>
  );
}

const Sidebar = () => {
  const dispatch = useDispatch();
  const isSidebarCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed,
  );

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const sidebarClassNames = `fixed flex flex-col ${
    isSidebarCollapsed ? 'w-0 md:w-16' : 'w-72 md:w-64'
  } bg-white transition-all duration-300 overflow-hidden h-full shadow-md z-40`;

  return (
    <div className={sidebarClassNames}>
      <div
        className={`flex items-center justify-between gap-3 pt-8 md:justify-normal ${
          isSidebarCollapsed ? 'px-5' : 'px-8'
        }`}
      >
        <img
          src={logo}
          alt="logo"
          width={27}
          height={27}
          className="w-8 rounded"
        />
        <h1
          className={`${
            isSidebarCollapsed ? 'hidden' : 'block'
          } text-2xl font-extrabold`}
        >
          DasaJaya
        </h1>

        <button
          className="rounded-full bg-gray-100 px-3 py-3 hover:bg-blue-100 md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* LINKS */}
      <div className="mt-8 flex-grow">
        <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/add-product"
          icon={FilePlus}
          label="Tambah produk"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Package}
          label="Produk"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/suppliers"
          icon={Truck}
          label="Supplier"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/categories"
          icon={Layers}
          label="Kategori"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/brands"
          icon={Tags}
          label="Brand"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/sales"
          icon={Archive}
          label="Penjualan"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Pengeluaran"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Pengguna"
          isCollapsed={isSidebarCollapsed}
        />
        {/* <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        /> */}
      </div>

      {/* FOOTER */}
      <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} mb-10`}>
        <p className="text-center text-xs text-gray-500">
          &copy; 2026 Dasa Jaya Motor
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
