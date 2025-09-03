<script setup lang="ts">
import type { StyleDefinition } from '~/components/StyleSwitcherControl.vue'
import maplibregl, { GeolocateControl, GlobeControl, NavigationControl, ScaleControl } from 'maplibre-gl'
// 导入我们自己的样式切换组件和它的类型
import StyleSwitcherControl from '~/components/StyleSwitcherControl.vue'

import TerraDrawControl from '~/components/TerraDraw/TerraDrawControl.vue'
import 'maplibre-gl/dist/maplibre-gl.css'

const mapContainer = ref<HTMLDivElement | null>(null)
const map = shallowRef<maplibregl.Map>()
const mapLoaded = ref(false) // 新增一个状态来跟踪地图是否加载完成

// 定义要切换的样式列表
const styles: StyleDefinition[] = [
  {
    title: 'Voyager',
    uri: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  },
  {
    title: 'Positron',
    uri: 'https://tiles.basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  },
  {
    title: 'Dark',
    uri: 'https://tiles.basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  },
]

onMounted(() => {
  if (mapContainer.value) {
    const initialMap = new maplibregl.Map({
      container: mapContainer.value,
      // 使用样式列表中的第一个作为初始样式
      style: styles[0]!.uri,
      center: [108.84, 31.06],
      zoom: 3.5,
    })

    // 监听 'load' 事件
    initialMap.on('load', () => {
      map.value = initialMap // 当地图加载完成后，再将 map 实例赋值给 ref
      mapLoaded.value = true // 更新状态
      console.warn('Map has loaded.')

      // 添加其他控件
      initialMap.addControl(new NavigationControl({ visualizePitch: true }), 'top-right')
      initialMap.addControl(new GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-right')
      initialMap.addControl(new GlobeControl(), 'top-right')
      initialMap.addControl(new ScaleControl(), 'bottom-left')
    })
  }
})

onUnmounted(() => {
  map.value?.remove()
})
</script>

<template>
  <div class="map-wrap">
    <div ref="mapContainer" class="map" />
    <!-- 仅在地图加载完成后再渲染控件 -->
    <ClientOnly>
      <TerraDrawControl v-if="map && mapLoaded" :map="map" />
      <!-- 将我们的新控件放在左下角 -->
      <StyleSwitcherControl
        v-if="map && mapLoaded"
        :map="map"
        :styles="styles"
        :initial-style-uri="styles[0]!.uri"
      />
    </ClientOnly>
  </div>
</template>

<style>
.map-wrap {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
