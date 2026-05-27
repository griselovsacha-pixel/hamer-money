"use client"

import { useState } from "react"
import { applyForJob, acceptApplication, completeJob } from "@/app/actions/job-actions"
import { useRouter } from "next/navigation"

type Application = {
  id: string
  freelancerId: string
  freelancerName: string | null
  freelancerImage: string | null
  status: string
}

interface Props {
  jobId: string
  employerId: string
  isEmployer: boolean
  alreadyApplied: boolean
  isAcceptedFreelancer: boolean
  jobStatus: string
  applications: Application[]
}

export default function JobActions({ jobId, employerId, isEmployer, alreadyApplied, isAcceptedFreelancer, jobStatus, applications }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleApply() {
    setLoading("apply")
    await applyForJob(jobId)
    router.refresh()
    setLoading(null)
  }

  async function handleAccept(appId: string) {
    setLoading(`accept-${appId}`)
    await acceptApplication(jobId, appId)
    router.refresh()
    setLoading(null)
  }

  async function handleComplete() {
    setLoading("complete")
    await completeJob(jobId)
    router.refresh()
    setLoading(null)
  }

  if (jobStatus === 'COMPLETED') {
    return <p className="text-green-600 font-medium">Це замовлення завершено.</p>
  }

  if (isEmployer && jobStatus === 'OPEN') {
    return (
      <div>
        <h3 className="text-xl font-semibold mb-3">Заявки ({applications.length})</h3>
        {applications.length === 0 ? (
          <p className="text-gray-500">Поки немає заявок.</p>
        ) : (
          <ul className="space-y-3">
            {applications.filter(app => app.status === 'PENDING').map(app => (
              <li key={app.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                <div className="flex items-center gap-2">
                  <img src={app.freelancerImage || "/default-avatar.png"} className="h-8 w-8 rounded-full" alt="" />
                  <span>{app.freelancerName}</span>
                </div>
                <button
                  onClick={() => handleAccept(app.id)}
                  disabled={loading === `accept-${app.id}`}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {loading === `accept-${app.id}` ? "..." : "Прийняти"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (isEmployer && jobStatus === 'IN_PROGRESS') {
    return (
      <div>
        <p className="mb-4">Виконавець прийнятий. Робота виконується.</p>
        <button
          onClick={handleComplete}
          disabled={loading === "complete"}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading === "complete" ? "Завершуємо..." : "Завершити замовлення"}
        </button>
      </div>
    )
  }

  // Якщо виконавець
  if (!isEmployer) {
    if (alreadyApplied) {
      return <p className="text-gray-500">Ви вже подали заявку. Очікуйте рішення замовника.</p>
    }
    if (jobStatus === 'OPEN') {
      return (
        <button
          onClick={handleApply}
          disabled={loading === "apply"}
          className="px-6 py-2 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading === "apply" ? "Подаємо..." : "Відгукнутися"}
        </button>
      )
    }
    if (isAcceptedFreelancer) {
      return <p className="text-blue-600">Ви прийняті на це замовлення. Працюйте!</p>
    }
  }

  return null
}
