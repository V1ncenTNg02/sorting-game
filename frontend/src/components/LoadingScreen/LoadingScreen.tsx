export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-lg text-gray-600">Loading…</p>
    </div>
  )
}
