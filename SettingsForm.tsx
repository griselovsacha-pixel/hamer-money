"use client"

import { useState } from "react"
import { updateProfile } from "@/app/actions/update-profile"
import { useRouter } from "next/navigation"

interface Props {
  initialData: {
    name: string
    bio: string
    image: string
    portfolioUrls: string[]
  }
}

export default function SettingsForm({ initialData }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initialData.name)
  const [bio, setBio] = useState(initialData.bio)
  const [image, setImage] = useState(initialData.image)
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>(initialData.portfolioUrls)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleAddPortfolio() {
    setPortfolioUrls([...portfolioUrls, ""])
  }

  function handlePortfolioChange(index: number, value: string) {
    const updated = [...portfolioUrls]
    updated[index] = value
    setPortfolioUrls(updated)
  }

  function handleRemovePortfolio(index: number) {
    setPortfolioUrls(portfolioUrls.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const result = await updateProfile({
      name,
      bio,
      image,
      portfolioUrls: portfolioUrls.filter(url => url.trim() !== ""),
    })
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
      router.push(`/profile/${result.userId}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-medium mb-1">Ім’я</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Біографія</label>
        <textarea
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">URL аватара</label>
        <input
          value={image}
          onChange={e => setImage(e.target.value)}
          placeholder="https://..."
          className="w-full px-4 py-2 border rounded-lg"
        />
        {image && (
          <img src={image} alt="preview" className="mt-2 h-16 w-16 rounded-full object-cover" />
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Портфоліо (посилання)</label>
        {portfolioUrls.map((url, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={url}
              onChange={e => handlePortfolioChange(index, e.target.value)}
              placeholder="https://..."
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button type="button" onClick={() => handleRemovePortfolio(index)} className="text-red-500">✕</button>
          </div>
        ))}
        <button type="button" onClick={handleAddPortfolio} className="text-sm text-[#FF7A00] hover:underline">
          + Додати посилання
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#FF7A00] text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  )
}
