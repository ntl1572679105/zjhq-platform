<template>
  <div id="container"></div>
  <div class="info" style="position: absolute;right: 10px;top:10px">
    <n-input-group>
      <n-input v-model:value="search" clearable/>
      <n-button type="primary" @click="handleSearch">
        {{$t('global.search')}}
      </n-button>
    </n-input-group>
  </div>
</template>

<script setup>
window._AMapSecurityConfig = {
  securityJsCode: '7221ec19c908ace2d9f59aa121a5d8d7'
}
import AMapLoader from "@amap/amap-jsapi-loader";
import {reactive, ref,onMounted,getCurrentInstance,defineProps,defineEmits} from "vue";
const {proxy} = getCurrentInstance()
const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  lat:{
    type: Number,
    default: 120.374926,
  },
  lng:{
    type: Number,
    default: 30.310678,
  }
})
const emit = defineEmits(['addressChange'])
const state = reactive({
  current_address:'',
  current_position: [],
});

const search=ref('')
const map =ref()
let placeSearch, AMapObj, marker, geocoder;
function initMap() {
  AMapLoader.load({
    key: "925ec0a662e3f61483f3608c84645cac", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  })
    .then((AMap) => {
      AMapObj = AMap;
      map.value = new AMap.Map("container", {
        //设置地图容器id
        viewMode: "3D", //是否为3D地图模式
        zoom: 10, //初始化地图级别
        center: [props.lng, props.lat], //初始化地图中心点位置
      });
      //添加插件
      AMap.plugin(["AMap.ToolBar", "AMap.Scale","AMap.PlaceSearch","AMap.AutoComplete",'AMap.Geocoder'], function () {
        //异步同时加载多个插件
        // map.addControl(new AMap.HawkEye()); //显示缩略图
        map.value.addControl(new AMap.Scale()); //显示当前地图中心的比例尺
        map.value.addControl(new AMap.ToolBar());
        placeSearch = new AMap.PlaceSearch({
          map: map.value,
          city: '',
          pageSize: 30, // 单页显示结果条数
          pageIndex: 1, // 页码
          citylimit: false, // 是否强制限制在设置的城市内搜索
          autoFitView: true,
        })
        const autoOptions = {
          // 使用联想输入的input的div的id
          input: 'tipinput',
        }
        // const autocomplete = new AMap.Autocomplete(autoOptions)
        console.log(AMap,'AMap1');

      });
      // 单击
      geocoder = new AMap.Geocoder({
        city: '全国',
      });
      // 添加标记和位置
      addMarker(props.lng, props.lat)
      map.value.on("click", (e) => {
        const { lng, lat } = e.lnglat;
        addMarker(lng, lat)
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
// 搜索地图
function handleSearch() {
  placeSearch.search(search.value, (status, result) => {
    if (result && typeof result === 'object' && result.poiList) {
      const list = result.poiList.pois;
      list.forEach(item => {
        item.value = item.name;
        item.label = item.name;
      });
    } else {
    }
  });
}
function addMarker(lng, lat) {
  state.current_position = [lng, lat];
  // console.log(e,'eeee');
  // 逆地理编码
  geocoder.getAddress([lng, lat], (status, result) => {
    console.log(status, result,'status, result');
    if (status === 'complete' && result.info === 'OK') {
      const { addressComponent, formattedAddress } = result.regeocode;
      state.current_address = formattedAddress
      emit('addressChange',{
        formattedAddress, lng, lat
      })
    }
  });
  if(marker){
    marker.setMap(null)
  }
  marker = new AMap.Marker({
    icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    position: state.current_position,
    offset: new AMap.Pixel(-26, -54),
  });
  map.value.add(marker);
}

onMounted(()=>{
  initMap();
})
const address =ref('')
//进行地图初始化
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height:400px;
}
</style>
