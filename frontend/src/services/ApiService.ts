import type { ShapeItem } from '../domain/ShapeItem'
import type {
  ApiScore,
  ApiGame,
  ApiGameItem,
  SubmitScoreResponse,
} from '../types/game.types'

export interface IApiService {
  getBestScore(): Promise<ApiScore | null>
  createGame(items: ShapeItem[]): Promise<ApiGame>
  completeGame(gameId: string, durationMs: number, items: ShapeItem[]): Promise<ApiGame>
  submitScore(value: number): Promise<SubmitScoreResponse>
  getGame(id: string): Promise<ApiGame | null>
}

export class ApiService implements IApiService {
  private static readonly BASE_URL = ''

  async getBestScore(): Promise<ApiScore | null> {
    try {
      const data = await this.get<ApiScore>('/api/best-score')
      this.logResponse('[Api] best-score:', data)
      return data
    } catch {
      return null
    }
  }

  async createGame(items: ShapeItem[]): Promise<ApiGame> {
    const data = await this.post<ApiGame>('/api/games', {
      items: this.toApiItems(items),
    })
    this.logResponse('[Api] game created:', data)
    return data
  }

  async completeGame(gameId: string, durationMs: number, items: ShapeItem[]): Promise<ApiGame> {
    const data = await this.patch<ApiGame>(`/api/games/${gameId}`, {
      duration_ms: durationMs,
      completed: true,
      items: this.toApiItems(items),
    })
    this.logResponse('[Api] game updated:', data)
    return data
  }

  async submitScore(value: number): Promise<SubmitScoreResponse> {
    const data = await this.post<SubmitScoreResponse>('/api/best-score', { value })
    this.logResponse('[Api] score submission:', data)
    return data
  }

  async getGame(id: string): Promise<ApiGame | null> {
    const data = await this.get<ApiGame>(`/api/games/${id}`)
    this.logResponse('[Api] game fetched:', data)
    return data
  }

  private async get<T>(path: string): Promise<T | null> {
    const res = await fetch(`${ApiService.BASE_URL}${path}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${ApiService.BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  private async patch<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${ApiService.BASE_URL}${path}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status}`)
    return res.json() as Promise<T>
  }

  private toApiItems(items: ShapeItem[]): ApiGameItem[] {
    return items.map(item => ({
      id: item.id,
      shape: item.shape,
      colour: item.colour,
      position: item.position,
    }))
  }

  private logResponse(label: string, data: unknown): void {
    console.debug(label, data)
  }
}
