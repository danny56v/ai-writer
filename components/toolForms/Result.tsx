import React from 'react'

const Result = ({ onClose }: { onClose: () => void }) => {
  return (
<>
 <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview Panel</h2>
        <button onClick={onClose} className="text-sm text-indigo-600 hover:underline">
          Close
        </button>
      </div>
      <p>This panel appears on the right side after you click the generate button.</p>
    </div>
</>
  )
}

export default Result
