<template>
  <div style="width: 100%; height: 400px">
    <div v-if="showSearch" class="flex search-box">
      <GMapAutocomplete
        @place_changed="setPlace"
        class="input-box"
        :placeholder="$t('global.map.search')"
      ></GMapAutocomplete>
      <n-button style="margin-left: 10px" type="primary" size="small" @click.stop="addMarker">{{
        $t('global.search2')
      }}</n-button>
    </div>
    <div style="width: 100%; height: 100%" id="google-map">
      <GMapMap
        :center="state.center"
        :options="state.options"
        :zoom="state.zoom"
        style="width: 100%; height: 400px"
      >
        <GMapMarker :position="state.center" :draggable="showSearch" @dragend="dragend" />
      </GMapMap>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';

const props = defineProps({
  // 默认坐标为纽约
  lat: {
    type: Number,
    default: 0,
  },
  lng: {
    type: Number,
    default: 0,
  },
  // 是否显示搜索
  showSearch: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['locationChange']);

const state = reactive({
  center: { lat: props.lat, lng: props.lng },
  zoom: 12,
  options: {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  },
  currentPlace: null,
});

onMounted(() => {
  console.log(1);
  if(!props.lat && !props.lng){
    console.log(2);
    geolocate();
  }
});

// 获取当前定位信息
const geolocate = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    state.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  },
    (error) => {
      // 默认坐标为纽约
      console.log(error);
      state.center = {
        lat: 40.7127753,
        lng: -74.0059728,
      };
    },
  );
};

// 查询到位置
const setPlace = (place) => {
  state.currentPlace = place;
};

// 确定位置
const addMarker = () => {
  console.log(state.currentPlace);
  if (state.currentPlace) {
    const marker = {
      lat: state.currentPlace.geometry.location.lat(),
      lng: state.currentPlace.geometry.location.lng(),
    };
    console.log(marker);
    state.center = marker;
    emits('locationChange', marker);
  }
};

// 拖到marker结束定位
const dragend = (marker) => {
  const position = { lat: marker.latLng.lat(), lng: marker.latLng.lng() };
  console.log(position);
  emits('locationChange', position);
};
</script>

<style lang="less" scoped>
.search-box {
  position: absolute;
  z-index: 100;
  top: 20px;
  left: 20px;
  background-color: white;
  align-items: center;
  padding: 10px;
}
.input-box {
  height: 34px;
  width: 250px;
  border: 1px solid #e0e0e0;
  padding: 0 10px;
  &:hover {
    border: 1px solid #4098fc;
  }
  &:focus {
    border: 1px solid #4098fc;
  }
}
</style>
