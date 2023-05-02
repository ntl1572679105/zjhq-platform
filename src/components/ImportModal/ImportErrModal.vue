<template>
  <a-modal
    :title="propData.title"
    :width="420"
    v-model:visible="visible"
    destroy-on-close
    cancel-text
    @ok="submitData"
    @cancel="submitData"
  >
    <div>
      <div style="margin-bottom: 20px">
        共{{ propData.total }}条数据，其中{{ propData.success }}条数据导入成功，{{
          propData.error
        }}条数据导入失败
      </div>
      <div>
        导入失败数据:
        <a-button style="margin-left: 20px" @click="downFile"> 下载表格 </a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash';
// import {importError} from "@/api/goods";

export default {
  name: 'ImportErrModal',
  data() {
    return {
      visible: false,
      propData: { title: '注意' },
    };
  },
  methods: {
    show(data) {
      this.visible = true;
      this.propData = cloneDeep(data);
    },
    submitData() {
      this.visible = false;
      this.$emit('finished');
    },
    downFile() {
      // importError({uuid:this.propData.uuid}).then(res=>{
      //   const blob = new Blob([res.data],{ type: 'xlsx' });
      //   const url = window.URL.createObjectURL(blob);
      //   const link = document.createElement('a');
      //   link.href = url;
      //   link.download = '导入失败数据.xlsx';
      //   link.remove()
      //   link.click();
      //   window.URL.revokeObjectURL(link.href);
      // })
    },
  },
};
</script>

<style scoped></style>
