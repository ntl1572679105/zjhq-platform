import { request } from '@/utils/request';

const DeptApi = {
  // 获取部门树
  DeptTree: '/erpBase/dept/tree',
  // 获取部门详情
  DeptDetail: '/erpBase/dept/',
  // 新增部门
  DeptAdd: '/erpBase/dept',
  // 修改部门
  DeptEdit: '/erpBase/dept',
  // 删除部门
  DeptDelete: '/erpBase/dept/',
};

export function deptTree(parameter) {
  return request({
    url: DeptApi.DeptTree,
    method: 'get',
    params: parameter,
  });
}

export function deptDetail(Deptid) {
  return request({
    url: DeptApi.DeptDetail + Deptid,
    method: 'get',
  });
}

export function deptAdd(parameter) {
  return request({
    url: DeptApi.DeptAdd,
    method: 'post',
    data: parameter,
  });
}

export function deptEdit(parameter) {
  return request({
    url: DeptApi.DeptEdit,
    method: 'put',
    data: parameter,
  });
}

export function deptDelete(Deptid) {
  return request({
    url: DeptApi.DeptDelete + Deptid,
    method: 'delete',
  });
}
