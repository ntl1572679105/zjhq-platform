<template>
  <PageContainer>
    <a-card :bordered="false" class="header mb-16" :bodyStyle="{ paddingRight: '0' }">
      <a-row class="justify-between">
        <a-col class="fl-48">
          <div class="header-left">
            <img src="@/assets/images/HomePage/Supply/logo-jd@2x.png" class="ml-13" width="24" />
          </div>
          <span class="f-18 ml-16 c-000000d9 f-5w">{{ formState.name }}</span>
        </a-col>
        <a-col class="items-center">
          <div
            class="header-right flex-col"
            v-for="(item, index) in formState.statisticItems"
            :key="index"
          >
            <span class="c-0085 f-24 f-6w plr64"
              >{{ item.data }}<span class="c-0085 f-14 f-5w fl-32h">{{ item.unit }}</span></span
            >
            <img
              v-if="item.type"
              :src="
                imgTool.getAssetsFile(`HomePage/Supply/icon-supply-${supplyRank[item.type]}@2x.png`)
              "
              alt=""
            />
            <span class="justify-center c-0045">{{ item.label }}</span>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-row :gutter="20">
      <a-col :span="15">
        <a-card class="mb-16 tab" :bodyStyle="{ padding: '4px 16px 16px 16px' }">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="招投标" force-render>
              <a-table :pagination="false" :columns="bidColumns" :dataSource="bidDataSource">
                <template #bodyCell="{ column, record, index, text }">
                  <template v-if="column.dataIndex === 'status'">
                    <div class="bidClass" :class="`bid${text}`">
                      {{ bidStatus[text] }}
                    </div>
                  </template>
                  <template v-else-if="column.key === 'time'">
                    {{ dayjs(text).format('YYYY-MM-DD HH:mm') }}
                  </template>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane key="2" tab="采购竞价">采购竞价</a-tab-pane>
            <template #rightExtra>
              <a>查看更多</a>
            </template>
          </a-tabs>
        </a-card>
        <HomePageCard
          shqTitle="采购执行订单"
          :shqColumns="execColumns"
          :shqDataSource="execDataSource"
          :type-arr="execOrderType"
          titleImgUrl="icon-sysytem-process"
        />
      </a-col>
      <a-col :span="9">
        <a-card :bordered="false" class="mb-16" :bodyStyle="{ padding: '14px 16px 16px 16px' }">
          <div slot="title" class="items-center justify-between mb-20 ptb10">
            <div class="flex-row">
              <img
                src="@/assets/images/HomePage/Supply/icon-supply-trolley@2x.png"
                width="48"
                height="48"
              />
              <div class="f-14 flex-col ml-16 justify-around">
                <span class="f-5w">{{ formState.name }}</span>
                <span class="f-4w"
                  >联系人: {{ formState.linkName }}
                  <span>联系电话: {{ formState.phone }}</span></span
                >
              </div>
            </div>
            <a :href="moreUrl" class="mr-4">详情</a>
          </div>
          <div class="btnGroup justify-around item">
            <a-button
              class="flex-col items-center"
              type="text"
              v-for="(item, index) in formState.btnGroup"
              :key="index"
            >
              <img :src="imgTool.getAssetsFile(`${item.imgUrl}`)" />
              <span class="mt-16">{{ item.label }}</span>
            </a-button>
          </div>
        </a-card>
        <HomePageCard
          shqTitle="审批流程"
          :shqColumns="approvalColumns"
          :shqDataSource="approvalDataSource"
          titleImgUrl="icon-system-account"
        />
      </a-col>
    </a-row>
  </PageContainer>
</template>

<script setup>
import { reactive, ref } from 'vue';
import imgTool from '@/utils/imgTool';
import HomePageCard from '@/components/HomePageCard/index.vue';
import dayjs from 'dayjs';

const activeKey = ref('1');

const formState = reactive({
  totalAmount: 518.11,
  totalNumber: 78,
  newSupplier: 89,
  warningInfo: 10,
  name: '京东商城',
  phone: 1515156161,
  linkName: '周到而',
  btnGroup: [
    {
      label: '招标项目',
      imgUrl: 'HomePage/Supply/icon-supply-container@2x.png',
    },
    {
      label: '采购订单',
      imgUrl: 'HomePage/Supply/icon-supply-file@2x.png',
    },
    {
      label: '合同管理',
      imgUrl: 'HomePage/Supply/icon-supply-audit@2x.png',
    },
    {
      label: '信息维护',
      imgUrl: 'HomePage/Supply/icon-supply-solution@2x.png',
    },
  ],
  statisticItems: [
    {
      label: '总采购金额',
      data: 643.82,
      unit: '/万元',
    },
    {
      label: '采购订单数',
      data: 56,
    },
    {
      label: '合同数量',
      data: 10,
    },
    {
      label: '供应商等级',
      type: 2,
    },
  ],
});
const execColumns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
  },
  {
    title: '客户公司',
    dataIndex: 'clientCompany',
    ellipsis: true,
  },
  {
    title: '订单类型',
    dataIndex: 'orderType',
    key: 'type',
  },
  {
    title: '采购员',
    dataIndex: 'buyer',
  },
  {
    title: '发布日期',
    dataIndex: 'createTime',
    key: 'date',
  },
];

const approvalColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    // ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
  },
  {
    title: '接收日期',
    dataIndex: 'createTime',
    ellipsis: true,
    key: 'date',
  },
];
const bidColumns = [
  {
    title: '招标单号',
    dataIndex: 'bidNo',
    ellipsis: true,
  },
  {
    title: '客户名称',
    dataIndex: 'supplierName',
  },
  {
    title: '投标开始时间',
    dataIndex: 'createTime',
    key: 'time',
  },
  {
    title: '投标结束时间',
    dataIndex: 'endTime',
    key: 'time',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
];

const execDataSource = [
  {
    orderNo: 'PJ175151515',
    clientCompany: '后勤集团公司',
    orderType: 0,
    buyer: '绿色绿色绿',
    createTime: '2021-12-24 20:20',
  },
  {
    orderNo: 'PJ175151515',
    clientCompany: '后勤集团公司',
    orderType: 1,
    buyer: '默认',
    createTime: '2021-12-20 20:20',
  },
  {
    orderNo: 'PJ175151515',
    clientCompany: '后勤集团公司',
    orderType: 1,
    buyer: '红色',
    createTime: '2021-12-20 20:20',
  },
  {
    orderNo: 'PJ175151515',
    clientCompany: '后勤集团公司',
    orderType: 2,
    buyer: '绿色',
    createTime: '2021-12-08 20:20',
  },
];
const approvalDataSource = [
  {
    title: 'TYJH-采购合同-张三-20230202',
    createBy: '欧阳震华',
    data: '2023-02-02',
  },
  {
    title: 'RGHT-后勤集团公司入围流程-张三-20230301',
    createBy: '迟泰',
    data: '2023-03-01',
  },
  {
    title: 'SF15156-采购合同-张三-20230131',
    createBy: '郝香纯',
    data: '2023-01-31',
  },
];

const bidDataSource = [
  {
    bidNo: 'BID202207250226',
    supplierName: '后勤集团公司',
    createTime: '2023-02-01 15:30',
    endTime: '2023-02-01 15:30',
    status: 1,
  },
  {
    bidNo: 'BID202207250326',
    supplierName: '后勤集团公司',
    createTime: '2023-02-01 15:30',
    endTime: '2023-02-01 15:30',
    status: 1,
  },
  {
    bidNo: 'BID202207254446',
    supplierName: '后勤集团公司',
    createTime: '2023-02-01 15:30',
    endTime: '2023-02-01 15:30',
    status: 2,
  },
  {
    bidNo: 'BID202207450106',
    supplierName: '后勤集团公司',
    createTime: '2023-02-01 15:30',
    endTime: '2023-02-01 15:30',
    status: 2,
  },
];

const execOrderType = ['一般产品订单', '水果生鲜订单', '办公用品订单'];
// potential-潜在, qualified-合格, shortlisted-入围
const supplyRank = ['', 'potential', 'qualified', 'shortlisted'];
const bidStatus = ['', '已投递', '已放弃'];
</script>

<style lang="less" scoped>
.header {
  .header-left {
    float: left;
    background-color: #c71621;
    height: 48px;
    width: 48px;
    border-radius: 100%;
  }
  .header-right {
    border-right: #e9e9e9 1px solid;
    &:last-child {
      border-right: 0;
    }
    img {
      width: 48px;
      height: 32px;
      margin: 0 auto;
    }
  }
}
// 按钮 group
.btnGroup {
  .ant-btn-text:hover {
    background-color: #fff;
  }
  button {
    height: auto;
  }
  img {
    width: 2vw;
    transition: all 0.2s ease-in;
    &:hover {
      transform: scale(1.3);
    }
  }
}
// tab切换卡
.tab {
  .bidClass::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    left: 5px;
    border-radius: 50%;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .bid1::before {
    background: #52c41a;
  }
  .bid2::before {
    background: #f6434c;
  }
}
</style>
