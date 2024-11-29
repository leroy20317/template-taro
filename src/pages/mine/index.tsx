/**
 * @author: leroy
 * @date: 2024-11-27 14:07
 * @description：Mine
 */

import { ActionSheet, Avatar, Button, Cell, SwipeCell } from '@taroify/core';
import { useMemo, useState } from 'react';
import Layout from '@/layout';
import avatar from '@/assets/icon.png';

const Mine = () => {
  const [open, setOpen] = useState(false);
  const actions = useMemo(
    () => [
      { name: '选项一', value: '1' },
      { name: '选项二', value: '2' },
      { name: '选项三', value: '3' },
    ],
    [],
  );
  return (
    <Layout>
      <div className="p-5">
        <Avatar className="mx-auto mb-8" size="large" src={avatar} />
        <div className="rounded-lg bg-white overflow-hidden">
          <Cell clickable isLink title="ActionSheet" onClick={() => setOpen(true)} />
          <SwipeCell>
            <SwipeCell.Actions side="left">
              <Button variant="contained" shape="square" color="primary">
                选择
              </Button>
            </SwipeCell.Actions>
            <Cell bordered={false} title="SwipeCell" />
            <SwipeCell.Actions side="right">
              <Button variant="contained" shape="square" color="danger">
                删除
              </Button>
              <Button variant="contained" shape="square" color="primary">
                收藏
              </Button>
            </SwipeCell.Actions>
          </SwipeCell>
        </div>

        <ActionSheet
          actions={actions}
          open={open}
          cancelText="取消"
          onSelect={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          onClose={setOpen}
        />
      </div>
    </Layout>
  );
};

definePageConfig({
  navigationBarTitleText: '我的',
});

export default Mine;
