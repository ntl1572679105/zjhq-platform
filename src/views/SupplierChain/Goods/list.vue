<template>
  <PageContainer>
    <TableSearch
      :formItems="formItems"
      :formData="formData"
      :columns="columns"
    ></TableSearch>
  </PageContainer>
</template>

<script setup>
import TableSearch from '@/components/TableSearch/index.vue'

const formItems = [
  {
    label: '商品名称',
    type: 'text',
  },
  {
    label: '商品编号',
    type: 'text',
  },
  {
    label: '商品类型',
    type: 'text',
  },
  {
    label: '商品状态',
    type: 'select'
  }
]

const columns = [
  {
    title: '商品编号',
    dataIndex: 'productNo'
  },
  {
    title: '商品名称',
    dataIndex: 'productName'
  },
  {
    title: '商品类型',
    dataIndex: 'productType'
  },
  {
    title: '型号',
    dataIndex: 'model'
  },
  {
    title: '规格',
    dataIndex: 'sku'
  },
  {
    title: '参数',
    dataIndex: 'parameter'
  },
  {
    title: '含税单价',
    dataIndex: 'taxPrice'
  },
  {
    title: '税点',
    dataIndex: 'texPoint'
  },
  {
    title: '上下架',
    dataIndex: 'shelves'
  },
  {
    title: '创建人',
    dataIndex: 'createBy'
  },
  {
    title: '修改时间',
    dataIndex: 'updateTime'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
]

</script>

<style lang="scss">

</style>