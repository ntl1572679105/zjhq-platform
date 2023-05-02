import antdEnUS from 'ant-design-vue/es/locale/en_US';

import 'dayjs/locale/en';

import global from './en_US/global';
import order from './en_US/order';
import goods from './en_US/goods';

const components = {
  antLocale: antdEnUS,
  dayjsName: 'en',
};

export default {
  ...components,
  ...global,
  ...order,
  ...goods
};
