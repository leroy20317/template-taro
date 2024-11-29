// 处理 AbortController 和 EventTarget 的兼容性 https://github.com/NervJS/taro/issues/15517
import 'event-target-polyfill';
import 'yet-another-abortcontroller-polyfill';

import { useEffect } from 'react';
// Taro 额外添加的 hooks 要从 '@tarojs/taro' 中引入
import { useDidShow, useDidHide } from '@tarojs/taro';

// 假设我们要使用 Redux
import { Provider } from 'react-redux';
import { makeStore } from './store/store';
// 全局样式
import './app.scss';

const store = makeStore();

function App({ children }) {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});
  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <Provider store={store}>
      {/* props.children 是将要被渲染的页面 */}
      {children}
    </Provider>
  );
}

export default App;
