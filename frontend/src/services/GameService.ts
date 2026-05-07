import { ShapeItem } from '../domain/ShapeItem'
import { Bucket } from '../domain/Bucket'
import { BUCKET_DEFINITIONS, ITEM_DEFINITIONS, ITEM_POSITIONS } from '../constants/game.constants'

export class GameService {
  generateItems(): ShapeItem[] {
    return ITEM_DEFINITIONS.map((def, i) =>
      new ShapeItem(`item-${i}`, def.shape, def.colour, ITEM_POSITIONS[i])
    )
  }

  generateBuckets(): Bucket[] {
    return BUCKET_DEFINITIONS.map(
      def => new Bucket(def.id, def.shape, def.colour, def.label)
    )
  }

  isComplete(unsortedItems: ShapeItem[]): boolean {
    return unsortedItems.length === 0
  }
}
