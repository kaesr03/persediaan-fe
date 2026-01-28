import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout, { loader as layoutLoader } from './ui/AppLayout';
import LandingPage from './ui/LandingPage';
import Error from './ui/Error';
import Product, {
  loader as productLoader,
  action as productAction,
} from './features/product/Product';
import Login, { action as loginAction } from './features/authentication/Login';
import ForgotPassword, {
  action as forgotPasswordAction,
} from './features/authentication/ForgotPassword';
import Register, {
  action as registerAction,
} from './features/authentication/Register';
import AddProducts, {
  loader as addProductLoader,
} from './features/product/AddProducts';
import Supplier, {
  action as supplierAction,
  loader as supplierLoader,
} from './features/supplier/Supplier';
import Category, {
  loader as categoryLoader,
  action as categoryAction,
} from './features/category/Category';
import Brand, {
  loader as brandLoader,
  action as brandAction,
} from './features/brand/Brand';
import Sales, { loader as saleLoader } from './features/sale/Sales';
import SaleDetail, {
  loader as loaderSaleDetail,
  action as actionSaleDetail,
} from './features/sale/SaleDetail';
import SaleFormWrapper, {
  action as saleFormAction,
  loader as saleFormLoader,
} from './features/sale/SaleFormWrapper';
import Expenses, { loader as expenseLoader } from './features/expense/Expenses';
import ExpenseDetail, {
  loader as expenseDetailLoader,
} from './features/expense/ExpenseDetail';
import Profile, {
  loader as profileLoader,
  action as profileAction,
} from './features/user/Profile';
import Dashboard, {
  loader as dashboardLoader,
} from './features/dashboard/Dashboard';
import ResetPassword, {
  action as resetPasswordAction,
} from './features/authentication/ResetPassword';
import ExpenseFormWrapper, {
  action as expenseFormAction,
  loader as expenseFormLoader,
} from './features/expense/ExpenseFormWrapper';
import ChangePassword, {
  action as changePasswordAction,
} from './features/user/ChangePassword';

const router = createBrowserRouter([
  {
    path: '',
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: '/logout',
        action: profileAction,
      },
      {
        path: '/register',
        element: <Register />,
        errorElement: <Error />,
        action: registerAction,
      },
      {
        element: <ForgotPassword />,
        path: '/forgotPassword',
        action: forgotPasswordAction,
      },
      {
        path: '/resetPassword/:token',
        element: <ResetPassword />,
        action: resetPasswordAction,
      },
    ],
  },

  {
    element: <AppLayout />,
    errorElement: <Error />,
    loader: layoutLoader,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: '/add-product',
        element: <AddProducts />,
        loader: addProductLoader,
      },
      {
        path: '/products',
        element: <Product />,
        action: productAction,
        loader: productLoader,
        errorElement: <Error />,
        children: [
          {
            path: ':productId',
            action: productAction,
            errorElement: <Error />,
          },
        ],
      },
      {
        path: '/suppliers',
        loader: supplierLoader,
        action: supplierAction,
        element: <Supplier />,
        children: [
          {
            path: ':supplierId',
            action: supplierAction,
            errorElement: <Error />,
          },
        ],
      },
      {
        path: '/categories',
        loader: categoryLoader,
        action: categoryAction,
        element: <Category />,
        children: [
          {
            path: ':categoryId',
            action: categoryAction,
          },
        ],
      },
      {
        path: '/brands',
        loader: brandLoader,
        action: brandAction,
        element: <Brand />,
        children: [
          {
            path: ':brandId',
            action: brandAction,
          },
        ],
      },
      {
        path: '/sales',
        element: <Sales />,
        loader: saleLoader,
      },
      {
        path: '/sales/:saleId',
        element: <SaleDetail />,
        loader: loaderSaleDetail,
        action: actionSaleDetail,
      },
      {
        path: '/sales/new',
        element: <SaleFormWrapper />,
        loader: saleFormLoader,
        action: saleFormAction,
      },
      {
        path: '/expenses',
        element: <Expenses />,
        loader: expenseLoader,
      },
      {
        path: '/expenses/:expenseId',
        element: <ExpenseDetail />,
        loader: expenseDetailLoader,
      },
      {
        path: '/expenses/new',
        element: <ExpenseFormWrapper />,
        loader: expenseFormLoader,
        action: expenseFormAction,
      },
      {
        path: '/users',
        element: <Profile />,
        loader: profileLoader,
        action: profileAction,
      },
      {
        path: '/changePassword',
        element: <ChangePassword />,
        action: changePasswordAction,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
