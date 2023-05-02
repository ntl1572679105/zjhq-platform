// 文件下载
export const fileDownTable = function (name, data) {
  const fileName = name;
  const blob = new Blob([data]);
  // let blob = new Blob([data], { type: 'application/x-7z-compressed' })
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob); // 本地保存
  } else {
    const link = document.createElement('a'); // a标签下载
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

export function formatTime(time, fmt) {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(time);
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const day = addZero(date.getDate());
  const hour = addZero(date.getHours());
  const minute = addZero(date.getMinutes());
  const second = addZero(date.getSeconds());
  const weekday = weekdays[date.getDay()];
  if (fmt === 'YMD') {
    // 年月日
    return `${year}-${month}-${day}`;
  } else if (fmt === 'HMS') {
    // 时分秒
    return `${hour}:${minute}:${second}`;
  } else if (fmt === 'WEEK') {
    // 周
    return weekday;
  } else {
    return '';
  }
}
// 小于10补0
export function addZero(num) {
  return num > 9 ? num : `0${num}`;
}

/**
 * 计算金额
 * 四舍五入，最多保留2位小数
 */
export function calAsset(asset) {
  return Math.round(asset * 100) / 100;
}

/**
 *
 * @param {金额} num
 * @returns 返回带有千分符的金额
 */
 export function formatNum(num) {
  if (typeof num !== 'number') {
    if (!num) return '0';
    // eslint-disable-next-line no-param-reassign
    num = Number(num);
  }
  return num.toLocaleString('en-US');
}

export function formatNum2(num) {
  if (typeof num !== 'number') {
    if (!num) return '$0';
    // eslint-disable-next-line no-param-reassign
    num = Number(num);
  }
  return `$${num.toLocaleString('en-US')}`;
}

/**
 *
 * @param {邮箱} email
 * @returns 对邮箱加密显示
 */
export function cryptoEmail(email) {
  if (email) {
    const array = email.split('@');
    if (array.length === 2) {
      return `${array[0].slice(0, 2)}***@${array[1]}`;
    } else {
      return email;
    }
  }
  return '';
}

export const fileDownload = (url, fileName) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    const newUrl = window.URL.createObjectURL(xhr.response);
    const a = document.createElement('a');
    a.setAttribute('href', newUrl);
    a.setAttribute('target', '_blank');
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  xhr.send();
};
