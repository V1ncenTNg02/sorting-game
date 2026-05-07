import type { ShapeType, ColourType, ItemPosition } from '../types/game.types'

export class ShapeItem {
  readonly id: string
  readonly shape: ShapeType
  readonly colour: ColourType
  readonly position: ItemPosition

  constructor(
    id: string,
    shape: ShapeType,
    colour: ColourType,
    position: ItemPosition = { x: 0, y: 0 }
  ) {
    this.id = id
    this.shape = shape
    this.colour = colour
    this.position = position
  }

  matchesColourBucket(colour: ColourType): boolean {
    return this.colour === colour
  }

  matchesShapeBucket(shape: ShapeType): boolean {
    return this.shape === shape
  }

  matchesBucket(shape: ShapeType, colour: ColourType): boolean {
    return this.shape === shape && this.colour === colour
  }
}
