<script setup lang="ts">
import type maplibregl from 'maplibre-gl'
import { TerraDraw } from 'terra-draw'
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter'
import { getDefaultModeOptions } from './getDefaultModeOptions'

const props = defineProps<{
  map: maplibregl.Map
}>()
// 定义你想要的模式
const ALL_MODES = [
  'render',
  'point',
  'linestring',
  'polygon',
  'rectangle',
  'circle',
  'freehand',
  'freehand-linestring',
  'angled-rectangle',
  'sensor',
  'sector',
  'select',
  'delete-selection',
  'delete',
  'download',
]
type TerradrawMode = (typeof ALL_MODES)[number]

const modes = ref<TerradrawMode[]>(ALL_MODES)
const isExpanded = ref(true) // 默认展开
const activeMode = ref<TerradrawMode | 'un-selected'>('un-selected')
const featureCount = ref(0)

let terraDraw: TerraDraw | null = null

onMounted(() => {
  if (!props.map)
    return

  const allModeOptions = getDefaultModeOptions()
  const enabledModes = Object.values(allModeOptions).filter(m => modes.value.includes(m.mode as TerradrawMode))

  terraDraw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map: props.map }),
    modes: enabledModes,
  })

  // TerraDraw v1.x 使用 'start'
  terraDraw.start()

  // 监听要素变化以更新按钮状态
  terraDraw.on('change', () => {
    if (terraDraw) {
      featureCount.value = terraDraw.getSnapshot().length
    }
  })
})

onUnmounted(() => {
  if (terraDraw) {
    // TerraDraw v1.x 使用 'stop'
    terraDraw.stop()
  }
})

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

function isButtonDisabled(mode: TerradrawMode) {
  if (['select', 'delete', 'download'].includes(mode)) {
    return featureCount.value === 0
  }
  return false
}

function getButtonClasses(mode: TerradrawMode) {
  const baseClasses = {
    'maplibregl-terradraw-add-control': true,
    'hidden': !isExpanded.value,
    'active': activeMode.value === mode,
  }

  // 动态添加特定模式的样式类
  if (mode === 'delete-selection') {
    return {
      ...baseClasses,
      'maplibregl-terradraw-delete-selection-button': true,
      'hidden-delete-selection': activeMode.value !== 'select' || featureCount.value === 0,
    }
  }

  return {
    ...baseClasses,
    [`maplibregl-terradraw-add-${mode}-button`]: !['delete', 'download'].includes(mode),
    [`maplibregl-terradraw-${mode}-button`]: ['delete', 'download'].includes(mode),
  }
}

function toggleEditor() {
  isExpanded.value = !isExpanded.value
  if (!isExpanded.value && terraDraw) {
    activeMode.value = 'un-selected'
    terraDraw.setMode('render')
  }
}

function handleButtonClick(mode: TerradrawMode) {
  if (!terraDraw)
    return

  switch (mode) {
    case 'delete':
      terraDraw.clear()
      terraDraw.setMode('render')
      activeMode.value = 'un-selected'
      break
    case 'delete-selection': {
      const selected = terraDraw.getSnapshot().filter(f => f.properties.selected)
      if (selected.length > 0) {
        terraDraw.removeFeatures(selected.map(f => f.id))
      }
      break
    }
    case 'download':
      downloadGeoJSON()
      break
    default: // 切换绘图模式
      if (activeMode.value === mode) {
        // 如果再次点击同一个按钮，则取消激活
        terraDraw.setMode('render')
        activeMode.value = 'un-selected'
      }
      else {
        terraDraw.setMode(mode)
        activeMode.value = mode
      }
  }
}

function downloadGeoJSON() {
  if (!terraDraw)
    return
  const features = terraDraw.getSnapshot()
  const fc = {
    type: 'FeatureCollection',
    features,
  }
  const dataStr = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fc))}`
  const download = document.createElement('a')
  download.setAttribute('href', dataStr)
  download.setAttribute('download', 'data.geojson')
  document.body.appendChild(download)
  download.click()
  download.remove()
}
</script>

<template>
  <div class="maplibregl-ctrl maplibregl-ctrl-group">
    <!-- 展开/折叠按钮 ('render' mode) -->
    <button
      v-if="modes.includes('render')"
      type="button"
      title="Toggle drawing tool"
      class="maplibregl-terradraw-render-button" :class="[{ enabled: isExpanded }]"
      @click="toggleEditor"
    />

    <!-- 绘图模式按钮 -->
    <template v-for="mode in modes" :key="mode">
      <button
        v-if="mode !== 'render'"
        type="button"
        :title="capitalize(mode.replace(/-/g, ' '))"
        :class="getButtonClasses(mode)"
        :disabled="isButtonDisabled(mode)"
        @click="() => handleButtonClick(mode)"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use './terradraw.scss';

.hidden {
  display: none !important;
}
.hidden-delete-selection {
  display: none !important;
}

.maplibregl-ctrl-group {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
</style>
