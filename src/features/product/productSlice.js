import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    getProductsState(state, action) {
      state.products = action.payload;
    },
  },
});

export const { getProductsState } = productSlice.actions;

export default productSlice.reducer;
