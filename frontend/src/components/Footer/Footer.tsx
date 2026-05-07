interface Props {
  bucketCount: number
}

export function Footer({ bucketCount }: Props) {
  return (
    <div className="flex items-center justify-between px-5 py-1.5 border-t border-gray-200 bg-white text-xs text-gray-400 shrink-0">
      <span className="tracking-wider uppercase font-medium">{bucketCount} Buckets Active</span>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span>System Ready</span>
        <span className="text-gray-300">v1.2.0</span>
      </div>
    </div>
  )
}
