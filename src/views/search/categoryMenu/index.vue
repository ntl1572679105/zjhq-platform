<template>
  <Teleport to="#searchCategory">
    <div class="content">
      <div class="title"><span v-if="list[0].parentId == '0'">所有分类：</span></div>
      <div class="list">
        <div v-for="(item, index) in list" :key="item.id">
          <a
            :class="{ active: item.id == categoryMenuIds[_level] }"
            @click="handleClickCategory(item, index)"
          >
            {{ item.name }}
          </a>
          <template v-if="item.children && item.children.length > 0 && item.id == searchOptions.id">
            <categoryMenuVue
              :list="item.children"
              :level="_level"
            ></categoryMenuVue>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, computed, inject } from 'vue';

const { categoryMenuIdChange, categoryMenuIds } = inject('categoryMenu');

const props = defineProps(['list', 'level']);

const _level = computed(() => {
  if (props.level || props.level === 0) {
    return props.level + 1;
  } else {
    return 0;
  }
});

const searchOptions = reactive({
  id: '',
});

const handleClickCategory = (item) => {
  searchOptions.id = item.id;
  categoryMenuIdChange(_level.value, item.id);
};
</script>

<style lang="less" scoped>
a {
  color: black;
}
a:hover {
  color: #fb6e23;
}
.active {
  color: #fb6e23;
}
.content {
  display: flex;

  background-color: #f6f6f6;
  padding: 16px 24px;
  margin-bottom: 8px;
  .title {
    width: 80px;
    flex-basis: 80px;
    font-weight: 700;
  }
  .list {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
  }
}
</style>
