export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">{text}</p>
      </div>
    </div>
  )
}
