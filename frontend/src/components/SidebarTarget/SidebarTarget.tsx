import { useDroppable } from '@dnd-kit/core'
import { Bucket } from '../../domain/Bucket'
import { ShapeIcon } from '../ShapeIcon/ShapeIcon'

interface Props {
  bucket: Bucket
  count: number
}

export function SidebarTarget({ bucket, count }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: bucket.id })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center gap-2.5 px-3 py-2 mx-1 my-0.5 rounded transition-colors duration-100 cursor-default
        ${isOver ? 'bg-blue-50 ring-1 ring-blue-300' : 'hover:bg-gray-50'}
      `}
    >
      <ShapeIcon shape={bucket.shape} colour={bucket.colour} size={18} strokeWidth={2} />
      <span className="flex-1 text-xs text-gray-700">{bucket.label}</span>
      <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
    </div>
  )
}
