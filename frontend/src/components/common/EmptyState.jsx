import { AlertCircle } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-gray-500 font-medium">{title}</h3>
      {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
    </div>
  )
}
