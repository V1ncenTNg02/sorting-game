import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { ShapeItem } from '../../domain/ShapeItem'
import { ShapeIcon } from '../ShapeIcon/ShapeIcon'

interface Props {
  item: ShapeItem
}

export function ShapeCard({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        transform: CSS.Translate.toString(transform),
        touchAction: 'none',
        zIndex: isDragging ? 50 : 1,
      }}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing select-none transition-opacity ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
    >
      <ShapeIcon shape={item.shape} colour={item.colour} size={46} />
    </div>
  )
}
