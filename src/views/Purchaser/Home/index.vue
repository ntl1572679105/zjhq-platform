<template>
  <PageContainer>
    <a-card :bordered="false" class="mb-20 h100">
      <a-row class="items-center justify-between">
        <a-col>
          <img src="@/assets/images/HomePage/logo-company@2x.png" width="48" />
          <span class="f-18 f-5w ml-20 c-0085">{{ formState.name }}</span>
        </a-col>
        <a-col class="items-center">
          <div
            class="dataBoard flex-col"
            v-for="(item, index) in formState.statisticItems"
            :key="index"
          >
            <span class="dataBoard_title c-0085 f-24 f-6w plr64"
              >{{ item.data }}<span class="c-0085 f-14 f-5w fl-32h">{{ item.unit }}</span></span
            >
            <span class="justify-center c-0045">{{ item.label }}</span>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <a-row :gutter="20">
      <a-col :span="15">
        <a-card :bordered="false" class="mb-16" :bodyStyle="{ padding: '16px' }">
          <div slot="title" class="h50">
            <img src="@/assets/images/HomePage/icon-sysytem-poll@2x.png" width="24" />
            <span class="f-5w f-16 c-0085 ml-8">招投标看板</span>
          </div>
          <a-row
            :gutter="16"
            v-for="(item, index) in formState.boardData"
            :key="index"
            class="board mb-8"
          >
            <a-col>
              <a-card
                :bordered="false"
                :bodyStyle="{ padding: '0', display: 'flex' }"
                class="justify-center h70 bg-1F5EBC14 w160"
              >
                <div class="flex-col justify-center">
                  <img
                    :src="imgTool.getAssetsFile(`${formState.boardItems[index].imgUrl}`)"
                    class="mr-8 h40"
                  />
                </div>
                <div class="flex-col justify-evenly">
                  <span class="f-14 f-5w c-004FC4 items-center">
                    {{ formState.boardItems[index].label }}</span
                  >
                  <span class="c-004FC4A6 f-5w f-12 h20 mt-4">
                    共计: {{ item.projAmount }}个项目
                  </span>
                </div>
              </a-card>
            </a-col>
            <a-col class="board_content align-center h70 bg-0000000a mr-8">
              <div class="board-flex1">
                <div
                  v-for="(jtem, index) in item.orderList.slice(0, 2)"
                  :key="index"
                  class="flex-column line pl12"
                >
                  <div class="f-14 mb-8">{{ jtem.name }}</div>
                  <div class="f-12">编号: {{ jtem.orderNo }} 负责人: {{ jtem.respeople }}</div>
                </div>
              </div>
              <a-button class="board_button mr-8 h32 bg-0000000a"><right-outlined /></a-button>
            </a-col>
          </a-row>
        </a-card>
        <HomePageCard
          shqTitle="审批流程"
          :shqColumns="approvalColumns"
          :shqDataSource="approvalDataSource"
          titleImgUrl="icon-sysytem-process"
          moreUrl="/purchasingManagement/demand-list"
        />
      </a-col>
      <a-col :span="9">
        <a-card :bordered="false" class="mb-16">
          <div class="btnGroup items-center justify-around">
            <a-button
              type="text"
              class="flex-col items-center"
              v-for="(item, index) in formState.btnGroup"
              :key="index"
            >
              <img :src="imgTool.getAssetsFile(`${item.imgUrl}`)" />
              <span class="mt-16">{{ item.label }}</span>
            </a-button>
          </div>
        </a-card>
        <HomePageCard
          shqTitle="采购订单"
          :shqColumns="orderColumns"
          :shqDataSource="orderDataSource"
          :statusArr="approvalStatus"
          titleImgUrl="icon-sysytem-file"
          class="mb-16"
          moreUrl="/purchasingManagement/order-list"
        >
          <template #onemore="record">
            <span
              v-if="record.text < 3"
              :class="`approval${record.text} statusPoint mr-8 ml-5 f-4w c-0085 f-14`"
            >
              <span>{{ approvalStatus[record.text] }}</span>
            </span>
            <span v-else class="approval3"
              ><a href=""
                ><img
                  class="mr-4"
                  src="@/assets/images/HomePage/icon-system-add@2x.png"
                  width="14"
                />新建</a
              ></span
            >
          </template>
        </HomePageCard>
        <HomePageCard
          shqTitle="需求管理"
          :shqColumns="demandColumns"
          :shqDataSource="demandDataSource"
          :typeArr="demandTypeArr"
          :statusArr="approvalStatus"
          titleImgUrl="icon-system-account"
        >
          <template #onemore="record">
            <span
              v-if="record.text < 3"
              :class="`approval${record.text} statusPoint mr-8 ml-5 f-4w c-0085 f-14`"
            >
              <span>{{ approvalStatus[record.text] }}</span>
            </span>
            <span v-else class="approval3"
              ><a href=""
                ><img
                  class="mr-4"
                  src="@/assets/images/HomePage/icon-system-add@2x.png"
                  width="14"
                />新建</a
              ></span
            >
          </template>
        </HomePageCard>
      </a-col>
    </a-row>
  </PageContainer>
</template>

<script setup>
import { reactive } from 'vue';
import imgTool from '@/utils/imgTool';
import { RightOutlined } from '@ant-design/icons-vue';
import HomePageCard from '@/components/HomePageCard/index.vue';

const formState = reactive({
  totalAmount: 518.11,
  totalNumber: 78,
  newSupplier: 89,
  warningInfo: 10,
  name: '后勤集团公司',
  btnGroup: [
    {
      label: '采购需求',
      imgUrl: 'HomePage/icon-purchase-demand@2x.png',
    },
    {
      label: '采购申请',
      imgUrl: 'HomePage/icon-purchase-trolley@2x.png',
    },
    {
      label: '采购寻源',
      imgUrl: 'HomePage/icon-purchase-shopping@2x.png',
    },
    {
      label: '采购合同',
      imgUrl: 'HomePage/icon-purchase-contract@2x.png',
    },
    {
      label: '采购需求',
      imgUrl: 'HomePage/icon-purchase-file@2x.png',
    },
  ],
  statisticItems: [
    {
      label: '当前实际采购',
      data: 412.82,
      unit: '/万元',
    },
    {
      label: '采购订单数',
      data: 78,
    },
    {
      label: '新增供应商',
      data: 89,
    },
    {
      label: '预警信息',
      data: 10,
    },
  ],
  boardItems: [
    {
      label: '寻源阶段',
      imgUrl: 'HomePage/icon-board-1@2x.png',
    },
    {
      label: '招标阶段',
      imgUrl: 'HomePage/icon-board-2@2x.png',
    },
    {
      label: '投标阶段',
      imgUrl: 'HomePage/icon-board-3@2x.png',
    },
    {
      label: '评审阶段',
      imgUrl: 'HomePage/icon-board-4@2x.png',
    },
    {
      label: '中标阶段',
      imgUrl: 'HomePage/icon-board-5@2x.png',
    },
    {
      label: '竞价阶段',
      imgUrl: 'HomePage/icon-board-6@2x.png',
    },
  ],
  boardData: [
    {
      projAmount: 22,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
    {
      projAmount: 4,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
    {
      projAmount: 6,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
    {
      projAmount: 12,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
    {
      projAmount: 34,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
    {
      projAmount: 2,
      orderList: [
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '周舒崇' },
        { name: '2023年蔬菜采购订单', orderNo: 'xa4151515', respeople: '欧阳旭嫣' },
      ],
    },
  ],
});
const orderColumns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
  },
  {
    title: '供应商',
    dataIndex: 'supplierName',
    ellipsis: true,
  },
  {
    title: '订单金额',
    dataIndex: 'orderAmount',
    align: 'center',
    key: 'money',
    width: 110,
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    key: 'extra',
    width: 110,
  },
];

const demandColumns = [
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
  },
  {
    title: '需求类型',
    dataIndex: 'demandType',
    key: 'type',
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 100,
  },
  {
    title: '审批状态',
    dataIndex: 'status',
    key: 'extra',
    width: 110,
  },
];

const approvalColumns = [
  {
    title: '标题',
    dataIndex: 'title',
    ellipsis: true,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
  },
  {
    title: '接收日期',
    dataIndex: 'createTime',
    key: 'date',
  },
];

const orderDataSource = [
  {
    orderNo: 'SF92792983',
    supplierName: '后勤集团公司',
    orderAmount: 5993.17,
    status: 0,
  },
  {
    orderNo: 'RT34879020',
    supplierName: '后勤集团公司',
    orderAmount: 5583.57,
    status: 1,
  },
  {
    orderNo: 'SF85903444',
    supplierName: '后勤集团公司',
    orderAmount: 5934.12,
    status: 2,
  },
  {
    orderNo: 'SF87130404',
    supplierName: '后勤集团公司',
    orderAmount: 5982.6,
    status: 3,
  },
];
const demandDataSource = [
  {
    orderNo: 'SF92792783',
    demandType: 0,
    createBy: '贾莉宁',
    status: 0,
  },
  {
    orderNo: 'RT34879020',
    demandType: 1,
    createBy: '君武',
    status: 1,
  },
  {
    orderNo: 'SF92792783',
    demandType: 2,
    createBy: '兰羽',
    status: 2,
  },
  {
    orderNo: 'SF92792783',
    demandType: 2,
    createBy: '尚秀哲',
    status: 3,
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

const approvalStatus = ['审批通过', '审批中', '审批失败', '新建'];
const demandTypeArr = ['生鲜采购', '蔬菜采购', '办公用品采购'];
</script>

<style lang="less" scoped>
// 数据board
.dataBoard {
  border-right: #e9e9e9 1px solid;
  &:last-child {
    border-right: 0;
    margin-right: -24px;
    .dataBoard_title {
      color: red;
    }
  }
}
// 招投标看板
.board {
  &:last-child {
    margin-bottom: 0;
  }
  .board_content {
    flex: 1;
    .board-flex1 {
      display: flex;
      flex: 1;
    }
    .board_button {
      width: 24px;
      background: #0000000a;
      border-radius: 2px;
      padding: 0;
      border: 0;
      height: 32px;
    }
    .line {
      flex: 1;
      &:first-child {
        border-right: 1px solid #0000000a;
      }
    }
  }
}
// 按钮Group
.btnGroup {
  button {
    height: auto;
  }
  .ant-btn-text:hover {
    background-color: #fff;
  }
  img {
    width: 36px;
    transition: all 0.2s ease-in;
    &:hover {
      transform: scale(1.3);
    }
  }
}
// 表格中的彩色小点
.approval0::before {
  background: #52c41a;
}
.approval1::before {
  background: #1b77ff;
}
.approval2::before {
  background: #f6434c;
}
.approval3 {
  color: #1b77ff;
  width: 28px;
  height: 23px;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 22px;
}
.statusPoint::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  left: 12px;
  border-radius: 50%;
  top: 0;
  bottom: 0;
  margin: auto;
}
</style>
