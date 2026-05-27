"use client"

import { useState } from "react"
import { categoryOptions, templates, Category } from "@/lib/job-templates"
import { createJob } from "@/app/actions/create-job"
import { useRouter } from "next/navigation"

export default function CreateJobPage() {
  const router = useRouter()
  const [category, setCategory] = useState<Category | "">("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedTemplate = category ? templates[category as Category] : []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    // Додаткові поля з шаблону зберемо як JSON у поле templateData
    const templateData: Record<string, string> = {}
    selectedTemplate.forEach(field => {
      const value = form.get(field.name)?.toString() || ""
      templateData[field.name] = value
    })
    form.append("templateData", JSON.stringify(templateData))
    form.set("category", category) // категорія вже є, але перестраховка

    const result = await createJob(form)
    setLoading(false)
    if (result?.error) {
      setError(typeof result.error === "string" ? result.error : "Помилка валідації")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Створити замовлення</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Категорія</label>
          <select
            name="category"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            required
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Оберіть категорію</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Назва замовлення</label>
          <input
            name="title"
            placeholder="Коротка назва"
            required
            className="w-full px-4 py-2 border rounded-lg"
            minLength={10}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Опис</label>
          <textarea
            name="description"
            placeholder="Детально опишіть завдання, вимоги, очікуваний результат"
            required
            rows={5}
            className="w-full px-4 py-2 border rounded-lg"
            minLength={50}
          />
        </div>

        {/* Додаткові поля шаблону */}
        {selectedTemplate.map(field => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-2 border rounded-lg"
              />
            )}
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Бюджет від (грн)</label>
            <input name="budgetMin" type="number" min="0" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-medium mb-1">Бюджет до (грн)</label>
            <input name="budgetMax" type="number" min="0" className="w-full px-4 py-2 border rounded-lg" />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Дедлайн</label>
          <input name="deadline" type="date" className="w-full px-4 py-2 border rounded-lg" />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading || !category}
          className="w-full py-3 bg-[#FF7A00] text-white rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Створюємо..." : "Опублікувати замовлення"}
        </button>
      </form>
    </div>
  )
}
