import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import ReviewForm from "./ReviewForm" // додамо пізніше

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      reviewsReceived: {
        include: { reviewer: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: 'desc' }
      },
      employerJobs: { where: { status: 'COMPLETED' }, select: { id: true, title: true } },
      applications: {
        where: { status: 'ACCEPTED', job: { status: 'COMPLETED' } },
        select: { id: true, job: { select: { id: true, title: true } } }
      }
    }
  })
  if (!user) notFound()

  const completedJobs = user.employerJobs.length + user.applications.length // загальна кількість завершених проектів
  const avgRating = user.reviewsReceived.length > 0
    ? (user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / user.reviewsReceived.length).toFixed(1)
    : null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Image
          src={user.image || "/default-avatar.png"}
          width={80}
          height={80}
          alt="аватар"
          className="rounded-full border-2 border-[#FF7A00]"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.name || "Анонім"}</h1>
          {avgRating && (
            <p className="text-yellow-500">★ {avgRating} ({user.reviewsReceived.length} відгуків)</p>
          )}
          <p className="text-gray-600">{user.bio || "Немає опису"}</p>
          <p className="text-sm text-gray-500">Завершених проектів: {completedJobs}</p>
        </div>
      </div>

      {user.portfolioUrls.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Портфоліо</h2>
          <ul className="list-disc pl-5 space-y-1">
            {user.portfolioUrls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#FF7A00] hover:underline">{url}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Відгуки</h2>
        {user.reviewsReceived.length === 0 ? (
          <p className="text-gray-500">Поки немає відгуків.</p>
        ) : (
          <div className="space-y-4">
            {user.reviewsReceived.map(review => (
              <div key={review.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Image src={review.reviewer.image || "/default-avatar.png"} width={24} height={24} className="rounded-full" alt="" />
                  <span className="font-medium">{review.reviewer.name}</span>
                  <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
