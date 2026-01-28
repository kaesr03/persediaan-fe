import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './ui/uiSlice';
import productReducer from './features/product/productSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    product: productReducer,
  },
});

export default store;
