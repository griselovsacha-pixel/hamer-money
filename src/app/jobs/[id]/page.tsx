import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import JobActions from "./JobActions"

export default async function JobPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      employer: { select: { id: true, name: true, image: true } },
      applications: {
        include: {
          freelancer: { select: { id: true, name: true, image: true } }
        }
      }
    }
  })
  if (!job) notFound()

  const session = await auth()
  const currentUserId = session?.user?.id
  const isEmployer = currentUserId === job.employerId
  const alreadyApplied = job.applications.some(app => app.freelancerId === currentUserId)
  const acceptedApplication = job.applications.find(app => app.status === 'ACCEPTED')
  const isAcceptedFreelancer = acceptedApplication?.freelancerId === currentUserId

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Замовник: {job.employer.name}</span>
        <span>•</span>
        <span>Створено: {new Date(job.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="prose max-w-none mb-8 whitespace-pre-wrap">{job.description}</div>

      <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
        <div><strong>Категорія:</strong> {job.category}</div>
        <div><strong>Статус:</strong> {job.status}</div>
        {job.budgetMin && job.budgetMax && (
          <div><strong>Бюджет:</strong> {job.budgetMin} – {job.budgetMax} грн</div>
        )}
        {job.deadline && (
          <div><strong>Дедлайн:</strong> {new Date(job.deadline).toLocaleDateString()}</div>
        )}
      </div>

      {/* Блок дій тільки для авторизованих */}
      {currentUserId ? (
        <JobActions
          jobId={job.id}
          employerId={job.employerId}
          isEmployer={isEmployer}
          alreadyApplied={alreadyApplied}
          isAcceptedFreelancer={isAcceptedFreelancer}
          jobStatus={job.status}
          applications={job.applications.map(app => ({
            id: app.id,
            freelancerId: app.freelancerId,
            freelancerName: app.freelancer.name,
            freelancerImage: app.freelancer.image,
            status: app.status,
          }))}
        />
      ) : (
        <p className="text-gray-500">
          <a href="/auth/signin" className="text-[#FF7A00] hover:underline">Увійдіть</a>, щоб відгукнутися або керувати замовленням.
        </p>
      )}
    </div>
  )
}
