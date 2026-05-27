import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const userId = session.user.id

  // Мої замовлення (де я замовник)
  const myJobs = await prisma.job.findMany({
    where: { employerId: userId },
    orderBy: { createdAt: 'desc' },
    include: { applications: true }
  })

  // Мої роботи – заявки, які я подав
  const myApplications = await prisma.application.findMany({
    where: { freelancerId: userId },
    include: {
      job: {
        select: { id: true, title: true, status: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Також отримаємо прийняті заявки (активні роботи), де status = 'ACCEPTED' і завдання не завершено
  const activeWorks = myApplications.filter(app => app.status === 'ACCEPTED' && app.job.status !== 'COMPLETED')
  const completedWorks = myApplications.filter(app => app.job.status === 'COMPLETED')

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Дашборд</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Мої замовлення (як замовник)</h2>
        {myJobs.length === 0 ? (
          <p className="text-gray-500">У вас поки немає замовлень.</p>
        ) : (
          <div className="grid gap-4">
            {myJobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{job.title}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    job.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                    job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {job.status === 'OPEN' ? 'Відкрито' : job.status === 'IN_PROGRESS' ? 'В роботі' : 'Завершено'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {job.applications.length} заявок
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Мої роботи (як виконавець)</h2>
        {activeWorks.length === 0 && completedWorks.length === 0 ? (
          <p className="text-gray-500">Ви ще не подали жодної заявки.</p>
        ) : (
          <>
            {activeWorks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Активні</h3>
                <div className="grid gap-3">
                  {activeWorks.map(app => (
                    <Link
                      key={app.id}
                      href={`/jobs/${app.job.id}`}
                      className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md"
                    >
                      <span className="font-medium">{app.job.title}</span>
                      <span className="ml-2 text-sm text-blue-600">В роботі</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {completedWorks.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Завершені</h3>
                <div className="grid gap-3">
                  {completedWorks.map(app => (
                    <Link
                      key={app.id}
                      href={`/jobs/${app.job.id}`}
                      className="p-4 bg-white rounded-lg border shadow-sm opacity-80"
                    >
                      <span className="font-medium">{app.job.title}</span>
                      <span className="ml-2 text-sm text-gray-500">Завершено</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
