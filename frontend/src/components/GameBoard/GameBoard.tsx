import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { ShapeItem } from '../../domain/ShapeItem'
import { Bucket } from '../../domain/Bucket'
import { TopBar } from '../TopBar/TopBar'
import { SidebarTarget } from '../SidebarTarget/SidebarTarget'
import { UnsortedArea } from '../UnsortedArea/UnsortedArea'
import { Footer } from '../Footer/Footer'

interface Props {
  unsortedItems: ShapeItem[]
  buckets: Bucket[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  onDragEnd: (event: DragEndEvent) => void
  onReset: () => void
}

export function GameBoard({
  unsortedItems,
  buckets,
  bucketCounts,
  elapsedSeconds,
  onDragEnd,
  onReset,
}: Props) {
  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-screen bg-white">
        <TopBar elapsed={elapsedSeconds} itemsLeft={unsortedItems.length} onReset={onReset} />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-44 border-r border-gray-200 flex flex-col shrink-0 bg-white">
            <div className="px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Drop Targets
            </div>
            <div className="flex-1 overflow-y-auto pb-2">
              {buckets.map(bucket => (
                <SidebarTarget
                  key={bucket.id}
                  bucket={bucket}
                  count={bucketCounts[bucket.id] ?? 0}
                />
              ))}
            </div>
          </aside>

          {/* Main board */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="px-7 pt-5 pb-2 shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">Unsorted Items</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Drag the shapes to their target workflow buckets in the sidebar.
              </p>
            </div>
            <UnsortedArea items={unsortedItems} />
          </main>
        </div>

        <Footer bucketCount={buckets.length} />
      </div>
    </DndContext>
  )
}
