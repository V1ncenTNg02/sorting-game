import { ShapeItem } from '../domain/ShapeItem'
import type { ShapeType, ColourType, ItemPosition } from '../types/game.types'

export interface PersistedGameState {
  status: 'playing'
  unsortedItems: ShapeItem[]
  bucketCounts: Record<string, number>
  elapsedSeconds: number
  sessionId: string | null
}

interface RawPersistedItem {
  id: string
  shape: ShapeType
  colour: ColourType
  position: ItemPosition
}

export interface ILocalStorageService {
  save(state: PersistedGameState): void
  load(): PersistedGameState | null
  clear(): void
}

export class LocalStorageService implements ILocalStorageService {
  private static readonly STORAGE_KEY = 'sorting-game:state'

  save(state: PersistedGameState): void {
    try {
      localStorage.setItem(LocalStorageService.STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota or private-browsing errors
    }
  }

  load(): PersistedGameState | null {
    try {
      const raw = localStorage.getItem(LocalStorageService.STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as {
        status: string
        unsortedItems: RawPersistedItem[]
        bucketCounts: Record<string, number>
        elapsedSeconds: number
        sessionId: string | null
      }
      if (parsed.status !== 'playing') return null
      return {
        status: 'playing',
        unsortedItems: parsed.unsortedItems.map(
          item => new ShapeItem(item.id, item.shape, item.colour, item.position)
        ),
        bucketCounts: parsed.bucketCounts,
        elapsedSeconds: parsed.elapsedSeconds,
        sessionId: parsed.sessionId,
      }
    } catch {
      return null
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(LocalStorageService.STORAGE_KEY)
    } catch {
      // Ignore errors
    }
  }
}
