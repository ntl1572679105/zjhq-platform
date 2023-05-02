import pcaJson from './pca-code.json';

// 递归获取省市区
const getDivision = (ob) => {
  if (!ob) return;
  if (Array.isArray(ob)) {
    return ob.map((child) => ({
      label: child.name,
      value: child.name,
      children: getDivision(child.children),
    }));
  } else {
    return { label: ob.name, value: ob.name };
  }
};

export const cascaderOptions = getDivision(pcaJson);
