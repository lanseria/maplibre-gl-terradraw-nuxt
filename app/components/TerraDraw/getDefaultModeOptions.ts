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
  const commonPolygonSelectOptions = {
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
  }
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
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-ignore
      validation: (feature: MapGeoJSONFeature, e: { updateType: string }) => {
        const updateType = e.updateType
        if (updateType === 'finish' || updateType === 'commit') {
          // eslint-disable-next-line ts/ban-ts-comment
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
        'point': {
          feature: {
            draggable: true,
          },
        },
        'polygon': commonPolygonSelectOptions,
        // 将通用的多边形配置应用到所有其他基于多边形的模式
        'rectangle': commonPolygonSelectOptions,
        'angled-rectangle': commonPolygonSelectOptions,
        'circle': commonPolygonSelectOptions,
        'freehand': commonPolygonSelectOptions,
        'sensor': commonPolygonSelectOptions,
        'sector': commonPolygonSelectOptions,
        'linestring': {
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
        'freehand-linestring': {
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
