import { request2 } from '@/utils/request';

const supplier = {
  // 分页查询供应商邀请码列表
  InvitationList: '/shqjcpt/operator/supplierInvitation/page',
  // 查询供应商邀请码详情
  InvitationDetail: '/shqjcpt/operator/supplierInvitation/',
  // 新增供应商邀请码
  InvitationAdd: '/shqjcpt/operator/supplierInvitation',
  // 删除供应商邀请码
  InvitationDelete: '/shqjcpt/operator/supplierInvitation/',

  // 分页查询供应商列表
  SupplierList: '/shqjcpt/operator/supplier/page',
  // 查询供应商详情
  SupplierDetail: '/shqjcpt/operator/supplier/',
  // 新增供应商(运营）
  SupplierAdd: '/shqjcpt/operator/supplier',
  // 新增供应商(供应商）
  SupplierSAdd: '/shqjcpt/operator/supplier/supplier',
  // 修改供应商
  SupplierUpdate: '/shqjcpt/operator/supplier',
  // 删除供应商
  SupplierDelete: '/shqjcpt/operator/supplier/',
  // 供应商入围审核
  SupplierApproval: '/shqjcpt/operator/supplier/approvalAudit',
  // 供应商重开入围审核
  SupplierRepeat: '/shqjcpt/operator/supplier/repeatApproval/',

  // 新增供应商资质
  CertificationAdd: '/shqjcpt/operator/supplierCertification',
  // 修改供应商资质
  CertificationEdit: '/shqjcpt/operator/supplierCertification',
  // 分页查询供应商资质列表
  CertificationPage: '/shqjcpt/operator/supplierCertification/page',
  // 查询供应商资质详情
  CertificationDetail: '/shqjcpt/operator/supplierCertification/',
  // 删除供应商资质
  CertificationDelete: '/shqjcpt/operator/supplierCertification/',

  // 分页查询合格供应商列表
  SupplierQualifiedList: '/shqjcpt/operator/supplier/qualifiedPage',
  // 查询供应商合格/淘汰申请详情
  SupplierQualifiedDetail: '/shqjcpt/operator/supplier/apply/',
  // 新增供应商合格/淘汰申请
  SupplierQualifiedApply: '/shqjcpt/operator/supplierQualifiedApply',
  // 删除供应商合格申请
  SupplierQualifiedDelete: '/shqjcpt/operator/supplierQualifiedApply/',
  // 供应商合格审核
  ApprovalQualifiedAudit: '/shqjcpt/operator/supplierQualifiedApply/approvalQualifiedAudit',
};

export function invitationList(params) {
  return request2({
    url: supplier.MenuList,
    method: 'get',
    params,
  });
}

export function invitationDetail(id) {
  return request2({
    url: supplier.InvitationDetail + id,
    method: 'get',
  });
}

export function invitationAdd(parameter) {
  return request2({
    url: supplier.InvitationAdd,
    method: 'post',
    data: parameter,
  });
}

export function invitationDelete(id) {
  return request2({
    url: supplier.InvitationDelete + id,
    method: 'delete',
  });
}

export function supplierList(params) {
  return request2({
    url: supplier.SupplierList,
    method: 'get',
    params,
  });
}

export function supplierDetail(id) {
  return request2({
    url: supplier.SupplierDetail + id,
    method: 'get',
  });
}

export function supplierAdd(parameter) {
  return request2({
    url: supplier.SupplierAdd,
    method: 'post',
    data: parameter,
  });
}

export function supplierSAdd(parameter) {
  return request2({
    url: supplier.SupplierSAdd,
    method: 'post',
    data: parameter,
  });
}

export function supplierUpdate(parameter) {
  return request2({
    url: supplier.SupplierUpdate,
    method: 'put',
    data: parameter,
  });
}

export function supplierDelete(id) {
  return request2({
    url: supplier.SupplierDelete + id,
    method: 'delete',
  });
}

export function supplierApproval(parameter) {
  return request2({
    url: supplier.SupplierApproval,
    method: 'post',
    data: parameter,
  });
}

export function supplierRepeat(id) {
  return request2({
    url: supplier.SupplierRepeat + id,
    method: 'post',
  });
}

export function supplierQualifiedList (params) {
  return request2({
    url: supplier.SupplierQualifiedList,
    method: 'get',
    params
  })
}

export function supplierCertificationAdd (parameter) {
  return request2({
    url: supplier.CertificationAdd,
    method: 'post',
    data: parameter
  })
}

export function supplierCertificationEdit (parameter) {
  return request2({
    url: supplier.CertificationEdit,
    method: 'put',
    data: parameter
  })
}

export function supplierCertificationPage (params) {
  return request2({
    url: supplier.CertificationPage,
    method: 'get',
    params
  })
}

export function supplierCertificationDetail (id) {
  return request2({
    url: supplier.CertificationDetail + id,
    method: 'get',
  })
}

export function supplierCertificationDel (id) {
  return request2({
    url: supplier.CertificationDelete + id,
    method: 'delete',
  })
}

export function invitationCodeList (params) {
  return request2({
    url: supplier.InvitationList,
    method: 'get',
    params
  })
}

export function supplierQualifiedDetail (id) {
  return request2({
    url: supplier.SupplierQualifiedDetail + id,
    method: 'get',
  })
}

export function supplierQualifiedApply (parameter) {
  return request2({
    url: supplier.SupplierQualifiedApply,
    method: 'post',
    data: parameter
  })
}

export function supplierQualifiedDelete (id) {
  return request2({
    url: supplier.SupplierQualifiedDelete + id,
    method: 'delete',
  })
}

export function approvalQualifiedAudit (parameter) {
  return request2({
    url: supplier.ApprovalQualifiedAudit,
    method: 'post',
    data: parameter
  })
}
