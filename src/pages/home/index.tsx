import { useState } from 'react';
import { useReady, useDidShow, useDidHide, usePullDownRefresh } from '@tarojs/taro';
import { Cascader, Field, Input, Popup } from '@taroify/core';
import { useAppSelector } from '@/store/store';
import styles from './index.module.scss';
import Layout from '@/layout';
import url from '@/utils/url';

const BasicCascader = () => {
  const { cities } = useAppSelector((state) => ({ cities: state.common.cities }));
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string[]>([]);
  const [fieldValue, setFieldValue] = useState('');
  return (
    <>
      <Field label="选项值" isLink onClick={() => setOpen(true)}>
        <Input readonly placeholder="请选择城市" value={fieldValue} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Popup.Close />
        <Cascader
          options={cities}
          value={value}
          title="请选择城市"
          placeholder="请选择"
          onSelect={setValue}
          onChange={(_values_, options) => {
            setOpen(false);
            setFieldValue(options.map((item) => item.children).join('/'));
          }}
        />
      </Popup>
    </>
  );
};
const Home = () => {
  // 对应 onReady
  useReady(() => {
    console.log('useReady');
  });

  // 对应 onShow
  useDidShow(() => {
    console.log('useDidShow');
  });

  // 对应 onHide
  useDidHide(() => {
    console.log('useDidHide');
  });

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Hooks】
  usePullDownRefresh(() => {
    console.log('usePullDownRefresh');
  });

  return (
    <Layout header={false}>
      <div className={styles.home}>
        home
        <div className="flex w-[70px]">aaa</div>
        <img className="w-full" src={`${url.staticHost}/images/cat.png`} alt="" />
        <BasicCascader />
      </div>
    </Layout>
  );
};

definePageConfig({
  navigationBarTitleText: '首页',
});

export default Home;
