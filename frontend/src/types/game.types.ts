export type ShapeType = 'triangle' | 'square' | 'circle'
export type ColourType = 'red' | 'green' | 'blue'
export type GameStatus = 'loading' | 'idle' | 'playing' | 'complete'

export interface ItemPosition {
  x: number
  y: number
}

export interface BucketDefinition {
  id: string
  shape: ShapeType
  colour: ColourType
  label: string
}

export interface ApiScore {
  id: number
  value: number      // milliseconds
  recordedAt: string // ISO string
}

export interface ApiGameItem {
  id: string
  shape: string
  colour: string
  position?: { x: number; y: number }
  bucketId?: string
}

export interface ApiGame {
  id: string
  items: ApiGameItem[]
  durationMs: number | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface SubmitScoreAccepted {
  accepted: true
  score: ApiScore
}

export interface SubmitScoreRejected {
  accepted: false
  reason: string
}

export type SubmitScoreResponse = SubmitScoreAccepted | SubmitScoreRejected
