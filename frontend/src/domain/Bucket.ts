import type { ShapeType, ColourType } from '../types/game.types'
import { ShapeItem } from './ShapeItem'

export class Bucket {
  readonly id: string
  readonly shape: ShapeType
  readonly colour: ColourType
  readonly label: string

  constructor(id: string, shape: ShapeType, colour: ColourType, label: string) {
    this.id = id
    this.shape = shape
    this.colour = colour
    this.label = label
  }

  accepts(item: ShapeItem): boolean {
    return item.matchesBucket(this.shape, this.colour)
  }
}
