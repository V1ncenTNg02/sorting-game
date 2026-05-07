import type { ShapeType, ColourType, BucketDefinition, ItemPosition } from '../types/game.types'

export const SHAPES: ShapeType[] = ['triangle', 'square', 'circle']
export const COLOURS: ColourType[] = ['red', 'green', 'blue']
export const ITEM_COUNT = 15

export const BUCKET_DEFINITIONS: BucketDefinition[] = [
  { id: 'bucket-red-triangle',   shape: 'triangle', colour: 'red',   label: 'Red Triangle'   },
  { id: 'bucket-red-square',     shape: 'square',   colour: 'red',   label: 'Red Square'     },
  { id: 'bucket-blue-triangle',  shape: 'triangle', colour: 'blue',  label: 'Blue Triangle'  },
  { id: 'bucket-blue-circle',    shape: 'circle',   colour: 'blue',  label: 'Blue Circle'    },
  { id: 'bucket-green-triangle', shape: 'triangle', colour: 'green', label: 'Green Triangle' },
  { id: 'bucket-green-square',   shape: 'square',   colour: 'green', label: 'Green Square'   },
  { id: 'bucket-blue-square',    shape: 'square',   colour: 'blue',  label: 'Blue Square'    },
]

// Ordered to pair with ITEM_DEFINITIONS by index
export const ITEM_POSITIONS: ItemPosition[] = [
  { x: 18, y: 16 },
  { x: 62, y: 10 },
  { x: 28, y: 58 },
  { x: 68, y: 72 },
  { x: 10, y: 68 },
  { x: 48, y: 32 },
  { x: 30, y: 82 },
  { x: 58, y: 48 },
  { x: 80, y: 18 },
  { x: 38, y: 14 },
  { x: 15, y: 44 },
  { x: 75, y: 58 },
  { x: 52, y: 70 },
  { x: 22, y: 30 },
  { x: 68, y: 28 },
]

// Each entry pairs with ITEM_POSITIONS[i]
export const ITEM_DEFINITIONS: Array<{ shape: ShapeType; colour: ColourType }> = [
  { shape: 'triangle', colour: 'red'   },
  { shape: 'triangle', colour: 'red'   },
  { shape: 'square',   colour: 'red'   },
  { shape: 'square',   colour: 'red'   },
  { shape: 'triangle', colour: 'blue'  },
  { shape: 'triangle', colour: 'blue'  },
  { shape: 'circle',   colour: 'blue'  },
  { shape: 'circle',   colour: 'blue'  },
  { shape: 'triangle', colour: 'green' },
  { shape: 'triangle', colour: 'green' },
  { shape: 'square',   colour: 'green' },
  { shape: 'square',   colour: 'green' },
  { shape: 'square',   colour: 'blue'  },
  { shape: 'square',   colour: 'blue'  },
  { shape: 'square',   colour: 'blue'  },
]
