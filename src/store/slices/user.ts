/**
 * @author: leroy
 * @date: 2021/9/26 15:01
 * @description：userSlice
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User } from '@/store/services/user';
import { getUserInfo } from '@/store/services/user';

export interface UserState {
  userInfo: User;
}

const initialState: UserState = {
  userInfo: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    save: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key as keyof UserState] = value;
      });
    },
  },
});

export const { save } = userSlice.actions;

export const fetchUserInfo = createAsyncThunk('user/getUserInfo', async (_, { dispatch }) => {
  const data = await getUserInfo();
  dispatch(save({ userInfo: data }));
  return data;
});

export default userSlice.reducer;
