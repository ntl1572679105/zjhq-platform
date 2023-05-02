import { request } from '@/utils/request';

const messageApi = {
  // 分页查询消息列表
  messageList: '/message/user/message/page',
  // 查询消息详情
  messageDetail: '/message/user/message/',
  // 查询未读消息数量
  messageCount: '/message/user/message/alert/count',
};

export function messageList(parameter) {
  return request({
    url: messageApi.messageList,
    method: 'get',
    params: parameter,
  });
}

export function messageDetail(messageid) {
  return request({
    url: messageApi.messageDetail + messageid,
    method: 'get',
  });
}

export function messageCount() {
  return request({
    url: messageApi.messageCount,
    method: 'get',
  });
}
