/*
 * @Author: leroy
 * @Date: 2024-11-28 14:23:58
 * @LastEditTime: 2025-05-08 15:26:33
 * @Description: layout
 */

import type { FC, ReactElement } from 'react';
import Header from './Header';
import SEO from './SEO';

const Layout: FC<{ header?: false; children: ReactElement }> = ({ header, children }) => {
  return (
    <>
      {process.env.TARO_ENV === 'h5' && <SEO />}
      {header !== false && <Header />}
      {children}
    </>
  );
};

export default Layout;
