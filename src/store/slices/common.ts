/**
 * @author: leroy
 * @date: 2021/9/26 15:01
 * @description：commonSlice
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { LabelValueList } from '@/store/services/common';
import { getCities } from '@/store/services/common';
import type { AppState } from '@/store/store';
import storage from '@/utils/storage';

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
    const cityData = storage.get('static_cities') || (await getCities());
    storage.set('static_cities', cityData);
    dispatch(saveCity(cityData));
    return cityData;
  },
);

export default commonSlice.reducer;
