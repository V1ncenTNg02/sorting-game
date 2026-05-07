import { useDroppable } from '@dnd-kit/core'
import { Bucket } from '../../domain/Bucket'

interface Props {
  bucket: Bucket
}

export function BucketZone({ bucket }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: bucket.id })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex items-center justify-center min-h-[80px] rounded-lg border-2 border-dashed
        transition-colors duration-150
        ${isOver ? 'ring-2 ring-blue-400 border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'}
      `}
    >
      <span className="text-sm font-medium capitalize text-gray-600">{bucket.label}</span>
    </div>
  )
}
