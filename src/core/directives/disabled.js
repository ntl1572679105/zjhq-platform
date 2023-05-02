import store from '@/store';

/**
 * 组件自定义指令，控制组件是否可以操作，通常用于switch等组件
 */
export default (app) => {
  app.directive('disabled', {
    mounted(el, binding, vnode) {
      // 当被绑定的元素插入到 DOM 中时
      // el: 指令所绑定的元素，可以用来直接操作 DOM。
      // binding：一个对象
      // vnode：Vue 编译生成的虚拟节点
      const { permissions } = store.getters;
      // if (permissions && permissions[0] === '*:*:*') {
      //   // 有全部权限，则不校验
      // } else
      if (binding.value) {
        // 指令的绑定值:v-disabled="{keys: 'add', more: 'ant-switch-disabled'}", 值为{keys: 'add', more: 'ant-switch-disabled'}
        // 指令的绑定值:v-disabled="['add']", 值为['add']
        // 校验是否有权限
        let hasPermission = false;
        if (Array.isArray(binding.value)) {
          for (const value of binding.value) {
            if (permissions.includes(value)) {
              hasPermission = true;
              return;
            }
          }
          if (!hasPermission) {
            el.disabled = true;
            el.className = `${el.className} ant-switch-disabled`;
          }
        } else {
          const { keys, more } = binding.value;
          for (const value of keys) {
            if (permissions.includes(value)) {
              hasPermission = true;
              return;
            }
          }
          console.log(binding);
          if (!hasPermission) {
            el.disabled = true;
            if (more) {
              el.className = `${el.className} ${more}`;
            }
          }
        }
      }
    },
  });
};
