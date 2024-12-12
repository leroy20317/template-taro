/**
 * @author: leroy
 * @date: 2021/8/23 16:09
 * @description：store
 */
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';

import seoReducer from './slices/seo';
import userReducer from './slices/user';
import loadingReducer from './slices/loading';
import commonReducer from './slices/common';

const combinedReducer = combineReducers({
  seo: seoReducer,
  user: userReducer,
  loading: loadingReducer,
  common: commonReducer,
});

const reducer = (state: any, action: any) => {
  return combinedReducer(state, action);
};
export const makeStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV === 'development',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = <TSelected>(selector: (state: AppState) => TSelected) => {
  return useSelector(selector, shallowEqual);
};
