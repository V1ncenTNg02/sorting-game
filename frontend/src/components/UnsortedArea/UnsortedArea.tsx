import { ShapeItem } from '../../domain/ShapeItem'
import { ShapeCard } from '../ShapeCard/ShapeCard'
import { GhostGrid } from '../GhostGrid/GhostGrid'

interface Props {
  items: ShapeItem[]
}

export function UnsortedArea({ items }: Props) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <GhostGrid />
      {items.length === 0 ? (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-300 pointer-events-none">
          All sorted!
        </p>
      ) : (
        items.map(item => <ShapeCard key={item.id} item={item} />)
      )}
    </div>
  )
}
