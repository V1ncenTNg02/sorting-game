export type ShapeType = 'triangle' | 'square' | 'circle'
export type ColourType = 'red' | 'green' | 'blue'
export type GameStatus = 'loading' | 'idle' | 'playing' | 'complete'

export interface ItemPosition {
  x: number
  y: number
}

export interface BucketDefinition {
  id: string
  shape: ShapeType
  colour: ColourType
  label: string
}
