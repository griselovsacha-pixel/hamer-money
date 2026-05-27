import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import StartChatButton from "@/components/StartChatButton"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await auth()
  const currentUserId = session?.user?.id

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

  const completedJobs = user.employerJobs.length + user.applications.length
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{user.name || "Анонім"}</h1>
          {avgRating && (
            <p className="text-yellow-500">★ {avgRating} ({user.reviewsReceived.length} відгуків)</p>
          )}
          <p className="text-gray-600">{user.bio || "Немає опису"}</p>
          <p className="text-sm text-gray-500">Завершених проектів: {completedJobs}</p>
        </div>
        {currentUserId && currentUserId !== user.id && (
          <StartChatButton participantId={user.id} />
        )}
      </div>
      {/* решта без змін */}
