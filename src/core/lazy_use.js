// base library
import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Tag,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Form,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Popover,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Tooltip,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  PageHeader,
  Space,
  message,
  notification,
  Tree,
  Pagination,
  Carousel,
  Cascader,
  Dropdown,
  Result,
  Image,
  Statistic,
  Avatar,
  List,
  Popconfirm,
  Timeline,
  Drawer,
  Empty,
  Badge,
  Rate,
} from 'ant-design-vue';

// ext library
import permisson from './directives/permission';
import disabled from './directives/disabled';

// icon 使用：https://www.antdv.com/components/icon-cn#components-icon-demo-iconfont
// 对应原来组件直接使用icon的要特别注意

export default (app) => {
  app.use(Tag);
  app.use(ConfigProvider);
  app.use(Layout);
  app.use(Input);
  app.use(InputNumber);
  app.use(Button);
  app.use(Switch);
  app.use(Radio);
  app.use(Checkbox);
  app.use(Select);
  app.use(Card);
  app.use(Form);
  app.use(Row);
  app.use(Col);
  app.use(Modal);
  app.use(Table);
  app.use(Tabs);
  app.use(Popover);
  app.use(Breadcrumb);
  app.use(Steps);
  app.use(Spin);
  app.use(Menu);
  app.use(Tooltip);
  app.use(Divider);
  app.use(DatePicker);
  app.use(TimePicker);
  app.use(Upload);
  app.use(Progress);
  app.use(Skeleton);
  app.use(PageHeader);
  app.use(Space);
  app.use(Tree);
  app.use(Pagination);
  app.use(Carousel);
  app.use(Cascader);
  app.use(Dropdown);
  app.use(Result);
  app.use(Image);
  app.use(Statistic);
  app.use(Avatar);
  app.use(List);
  app.use(Popconfirm);
  app.use(Timeline);
  app.use(Drawer);
  app.use(Empty);
  app.use(Badge);
  app.use(Rate);

  app.config.globalProperties.$confirm = Modal.confirm;
  app.config.globalProperties.$message = message;
  app.config.globalProperties.$notification = notification;
  app.config.globalProperties.$info = Modal.info;
  app.config.globalProperties.$success = Modal.success;
  app.config.globalProperties.$error = Modal.error;
  app.config.globalProperties.$warning = Modal.warning;

  permisson(app);
  disabled(app);
};
