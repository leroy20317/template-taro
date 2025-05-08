/*
 * @Author: leroy
 * @Date: 2024-11-28 14:23:58
 * @LastEditTime: 2025-05-08 15:25:36
 * @Description: commonSlice
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCities } from '@/store/services/common';
import type { AppState } from '@/store/store';

export interface CommonState {
  cities: LabelValueList;
}

const initialState: CommonState = {
  cities: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    saveCity: (state, action: PayloadAction<CommonState['cities']>) => {
      state.cities = action.payload;
    },
  },
});

export const { saveCity } = commonSlice.actions;

// 获取省市
export const fetchCities = createAsyncThunk(
  'common/getCities',
  async (_, { dispatch, getState }) => {
    const list = (getState() as AppState).common.cities;
    if (list?.length) {
      return list;
    }

    const data = await getCities();
    dispatch(saveCity(data));
    return data;
  },
);

export default commonSlice.reducer;
