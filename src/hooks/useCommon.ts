/**
 * @author: leroy
 * @date: 2024-11-26 14:55
 * @description：useCommon
 */
import { useEffect } from 'react';
import { fetchCities } from '@/store/slices/common';
import { useAppDispatch } from '@/store/store';

const useCommon = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log('useCommon');
    dispatch(fetchCities());
  }, []);
};

export default useCommon;
