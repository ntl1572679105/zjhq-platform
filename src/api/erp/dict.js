import { request } from '@/utils/request';

const dictApi = {
  // 查询字典类型列表
  DictTypeList: '/erpBase/dict/type/list',
  // 获取字典类型详情
  DictTypeDetail: '/erpBase/dict/type/',
  // 新增字典类型
  DictTypeAdd: '/erpBase/dict/type',
  // 修改字典类型
  DictTypeEdit: '/erpBase/dict/type',
  // 删除字典类型
  DictTypeDelete: '/erpBase/dict/type/',

  // 查询字典数据列表
  DictDataList: '/erpBase/dict/data/list/',
  // 获取字典数据详情
  DictDataDetail: '/erpBase/dict/data/',
  // 新增字典数据
  DictDataAdd: '/erpBase/dict/data',
  // 修改字典数据
  DictDataEdit: '/erpBase/dict/data',
  // 删除字典数据
  DictDataDelete: '/erpBase/dict/data/',
};

export function dictTypeList(parameter) {
  return request({
    url: dictApi.DictTypeList,
    method: 'get',
    params: parameter,
  });
}

export function DictTypeDetail(id) {
  return request({
    url: dictApi.DictTypeDetail + id,
    method: 'get',
  });
}

export function dictTypeAdd(parameter) {
  return request({
    url: dictApi.DictTypeAdd,
    method: 'post',
    data: parameter,
  });
}

export function dictTypeEdit(parameter) {
  return request({
    url: dictApi.DictTypeEdit,
    method: 'put',
    data: parameter,
  });
}

export function dictTypeDelete(id) {
  return request({
    url: dictApi.DictTypeDelete + id,
    method: 'delete',
  });
}

export function dictDataList(params) {
  return request({
    url: dictApi.DictDataList + params.dictTypeId,
    method: 'get',
  });
}

export function dictDataDetail(id) {
  return request({
    url: dictApi.DictDataDetail + id,
    method: 'get',
  });
}

export function dictDataAdd(parameter) {
  return request({
    url: dictApi.DictDataAdd,
    method: 'post',
    data: parameter,
  });
}

export function dictDataEdit(parameter) {
  return request({
    url: dictApi.DictDataEdit,
    method: 'put',
    data: parameter,
  });
}

export function dictDataDelete(id) {
  return request({
    url: dictApi.DictDataDelete + id,
    method: 'delete',
  });
}
