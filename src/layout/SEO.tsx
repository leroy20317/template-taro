/*
 * @Author: leroy
 * @Date: 2025-03-27 17:42:36
 * @LastEditTime: 2025-03-27 17:44:47
 * @Description:
 */
import { Helmet } from 'react-helmet';
import { useAppSelector } from '@/store/store';

const SEO = () => {
  const { title, description, keywords } = useAppSelector((state) => state.seo);
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

export default SEO;
