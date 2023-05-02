import antd from 'ant-design-vue/es/locale/zh_CN';

import 'dayjs/locale/zh-cn';

import global from './zh_CN/global';
import order from './zh_CN/order';
import goods from './zh_CN/goods';

const components = {
  antLocale: antd,
  dayjsName: 'zh-cn',
};

export default {
  message: '-',

  ...components,
  ...global,
  ...order,
  ...goods
};
