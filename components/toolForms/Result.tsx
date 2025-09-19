import React from 'react'

const Result = ({ onClose }: { onClose: () => void }) => {
  return (
<>
 <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Componenta Dreapta</h2>
        <button onClick={onClose} className="text-sm text-indigo-600 hover:underline">
          Închide
        </button>
      </div>
      <p>Aceasta apare în partea dreaptă când apeși butonul.</p>
    </div>
</>
  )
}

export default Result