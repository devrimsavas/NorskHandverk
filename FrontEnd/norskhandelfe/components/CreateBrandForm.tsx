'use client'
import { useState } from 'react'
import { createBrand } from "@/modules/brandactions"

interface Props {
  onCreated: () => void   // listeyi yenilemek için parent'tan gelecek
}

const CreateBrandForm = ({ onCreated }: Props) => {

  const [newBrandName, setNewBrandName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newBrandName.trim()) return

    try {
      setLoading(true)
      await createBrand({ name: newBrandName })
      setNewBrandName("")
      onCreated()   // parent'a "yenile" de
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mb-6"
    >
      <input
        type="text"
        value={newBrandName}
        onChange={(e) => setNewBrandName(e.target.value)}
        placeholder="New brand name"
        className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  )
}

export default CreateBrandForm
