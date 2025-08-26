<!-- components/StyleSwitcherControl.vue -->
<script setup lang="ts">
import type { Map } from 'maplibre-gl'
import { ref } from 'vue'

// 定义 StyleDefinition 接口，与原插件保持一致
export interface StyleDefinition {
  title: string
  uri: string
}

const props = defineProps<{
  map: Map
  styles: StyleDefinition[]
  initialStyleUri: string
}>()

const isOpen = ref(false)
const currentStyleUri = ref(props.initialStyleUri)

function toggleStyleList() {
  isOpen.value = !isOpen.value
}

function switchStyle(styleUri: string) {
  if (props.map && currentStyleUri.value !== styleUri) {
    props.map.setStyle(styleUri)
    currentStyleUri.value = styleUri
    isOpen.value = false // 切换后自动关闭列表
  }
}
</script>

<template>
  <div class="maplibregl-ctrl maplibregl-ctrl-group style-switcher">
    <button
      class="style-switcher-button"
      title="Change map style"
      @click="toggleStyleList"
    >
      <!-- 这是一个简单的图标，你可以替换成自己的 SVG 图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 12c0-5.25-4.25-9.5-9.5-9.5S2.5 6.75 2.5 12s4.25 9.5 9.5 9.5s9.5-4.25 9.5-9.5z" /><path d="M12 2.5c2.75 0 5.25 1 7 2.75" /><path d="M12 21.5c-2.75 0-5.25-1-7-2.75" /></svg>
    </button>
    <ul v-if="isOpen" class="style-switcher-list">
      <li v-for="style in styles" :key="style.title">
        <button
          :class="{ active: currentStyleUri === style.uri }"
          @click="() => switchStyle(style.uri)"
        >
          {{ style.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.style-switcher {
  position: relative;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
  font-size: 14px;
}

.style-switcher-button {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}
.style-switcher-button:hover {
  background-color: #f0f0f0;
}

.style-switcher-list {
  position: absolute;
  bottom: 100%; /* 列表出现在按钮上方 */
  left: 0;
  list-style: none;
  padding: 0;
  margin: 0 0 5px 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  width: 120px; /* 列表宽度 */
  overflow: hidden;
}

.style-switcher-list li button {
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 14px;
}

.style-switcher-list li button:hover {
  background-color: #f0f0f0;
}

.style-switcher-list li button.active {
  background-color: #3887be;
  color: #fff;
}
</style>
