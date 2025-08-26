import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { TerradrawModeClass } from '~/interfaces/terradraw'
import {
  TerraDrawAngledRectangleMode,
  TerraDrawCircleMode,
  TerraDrawFreehandLineStringMode,
  TerraDrawFreehandMode,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawRectangleMode,
  TerraDrawRenderMode,
  TerraDrawSectorMode,
  TerraDrawSelectMode,
  TerraDrawSensorMode,
  ValidateNotSelfIntersecting,
} from 'terra-draw'

export interface ModeOptions {
  [key: string]: TerradrawModeClass
}

export function getDefaultModeOptions() {
  const modeOptions: ModeOptions = {
    'render': new TerraDrawRenderMode({
      modeName: 'render',
      styles: {},
    }),
    'point': new TerraDrawPointMode({
      editable: true,
    }),
    'linestring': new TerraDrawLineStringMode({
      editable: true,
    }),
    'polygon': new TerraDrawPolygonMode({
      editable: true,
      // @ts-ignore
      validation: (feature: MapGeoJSONFeature, e: { updateType: string }) => {
        const updateType = e.updateType
        if (updateType === 'finish' || updateType === 'commit') {
          // @ts-ignore
          return ValidateNotSelfIntersecting(feature)
        }
        return { valid: true }
      },
    }),
    'rectangle': new TerraDrawRectangleMode(),
    'angled-rectangle': new TerraDrawAngledRectangleMode(),
    'circle': new TerraDrawCircleMode(),
    'freehand': new TerraDrawFreehandMode(),
    'freehand-linestring': new TerraDrawFreehandLineStringMode(),
    'sensor': new TerraDrawSensorMode(),
    'sector': new TerraDrawSectorMode(),
    'select': new TerraDrawSelectMode({
      flags: {
        point: {
          feature: {
            draggable: true,
          },
        },
        polygon: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        linestring: {
          feature: {
            draggable: true,
            rotateable: true,
            scaleable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        // ... (可以从原文件复制所有其他几何类型的默认选择配置)
      },
    }),
    'delete': new TerraDrawRenderMode({
      modeName: 'delete',
      styles: {},
    }),
    'delete-selection': new TerraDrawRenderMode({
      modeName: 'delete-selection',
      styles: {},
    }),
    'download': new TerraDrawRenderMode({
      modeName: 'download',
      styles: {},
    }),
  }
  return modeOptions
}
