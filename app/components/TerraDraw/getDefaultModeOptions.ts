// app/components/TerraDraw/getDefaultModeOptions.ts
import type { MapGeoJSONFeature } from 'maplibre-gl'
import type { TerradrawModeClass } from '~/interfaces/terradraw'
import {
  TerraDrawPolygonMode,
  TerraDrawRenderMode,
  TerraDrawSelectMode,
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
    'select': new TerraDrawSelectMode({
      flags: {
        polygon: commonPolygonSelectOptions,
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
  }
  return modeOptions
}
