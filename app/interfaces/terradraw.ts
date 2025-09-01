// app/interfaces/terradraw.ts
import type {
  TerraDrawPolygonMode,
  TerraDrawRenderMode,
  TerraDrawSelectMode,
} from 'terra-draw'

/**
 * TerraDraw mode class types
 * 这是一个联合类型，包含了所有 terra-draw 库中可用的模式类。
 * 它用于确保我们传递给 TerraDraw 实例的模式都是有效的。
 */
export type TerradrawModeClass
	= | TerraDrawPolygonMode
	  | TerraDrawRenderMode
	  | TerraDrawSelectMode
