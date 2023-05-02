import store from '@/store';

export default function hasPermission(values) {
  const {permissions} = store.getters;
  if (permissions && permissions[0] === '*:*:*') {
    // 有全部权限，则不校验
    return true;
  }
  let isExit = false;
  for (const value of values) {
    if (permissions.includes(value)) {
      isExit = true;
      return;
    }
  }
  return isExit;
}
