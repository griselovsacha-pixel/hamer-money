import Link from "next/link"

const categories = [
  "Розробка сайтів та додатків",
  "Створення сайтів",
  "Доробка сайту",
  "Створення Landing page",
  "Верстка сайту",
  "Тестування ПЗ (QA)",
  "Впровадження 1C",
  "Послуги в сфері IT",
  "Розробка мобільних додатків",
  "Розробка ігор",
  "Створення та розробка технічного завдання",
  "Кібербезпека",
  "Інші роботи з розробки сайтів",
]

export default function HomePage() {
  return (
    <div>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Знайди IT-спеціаліста або проект своєї мрії
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Hamer Money – фріланс-біржа для розробників, тестувальників, дизайнерів і не тільки.
          Без комісій, без посередників. Просто бери та роби.
        </p>
      </section>

      {/* Пошук */}
      <div className="max-w-xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Пошук замовлень..."
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Категорії */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/jobs?category=${encodeURIComponent(cat)}`}
            className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition text-center text-sm font-medium hover:text-[#FF7A00]"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  )
}
