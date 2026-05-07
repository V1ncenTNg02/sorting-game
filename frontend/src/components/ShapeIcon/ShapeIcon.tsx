import type { ShapeType, ColourType } from '../../types/game.types'

const COLOUR_MAP: Record<ColourType, string> = {
  red:   '#dc2626',
  green: '#16a34a',
  blue:  '#2563eb',
}

interface Props {
  shape: ShapeType
  colour: ColourType
  size?: number
  strokeWidth?: number
}

export function ShapeIcon({ shape, colour, size = 48, strokeWidth = 2.5 }: Props) {
  const stroke = COLOUR_MAP[colour]

  if (shape === 'circle') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`${colour} ${shape}`}>
        <circle cx="24" cy="24" r="19" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      </svg>
    )
  }

  if (shape === 'square') {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`${colour} ${shape}`}>
        <rect x="5" y="5" width="38" height="38" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      </svg>
    )
  }

  // triangle
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label={`${colour} ${shape}`}>
      <polygon points="24,5 43,43 5,43" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </svg>
  )
}
