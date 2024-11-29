/**
 * @author: leroy
 * @date: 2024-11-27 09:51
 * @description：layout
 */
import type { FC, ReactElement } from 'react';
import Header from './Header';
import useCommon from '@/hooks/useCommon';

const Layout: FC<{ header?: false; children: ReactElement }> = ({ header, children }) => {
  useCommon();
  return (
    <>
      {header !== false && <Header />}
      {children}
    </>
  );
};

export default Layout;
