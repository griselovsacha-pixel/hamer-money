export type Category = 
  | 'WEBSITE_DEVELOPMENT'
  | 'LANDING_PAGE'
  | 'WEBSITE_REFINEMENT'
  | 'MARKUP'
  | 'QA'
  | 'ONE_C'
  | 'IT_SERVICES'
  | 'MOBILE_APP'
  | 'GAME_DEV'
  | 'TECH_SPEC'
  | 'CYBERSECURITY'
  | 'OTHER'

export const categoryOptions: { value: Category; label: string }[] = [
  { value: 'WEBSITE_DEVELOPMENT', label: 'Розробка сайтів та додатків' },
  { value: 'LANDING_PAGE', label: 'Створення Landing page' },
  { value: 'WEBSITE_REFINEMENT', label: 'Доробка сайту' },
  { value: 'MARKUP', label: 'Верстка сайту' },
  { value: 'QA', label: 'Тестування ПЗ (QA)' },
  { value: 'ONE_C', label: 'Впровадження 1C' },
  { value: 'IT_SERVICES', label: 'Послуги в сфері IT' },
  { value: 'MOBILE_APP', label: 'Розробка мобільних додатків' },
  { value: 'GAME_DEV', label: 'Розробка ігор' },
  { value: 'TECH_SPEC', label: 'Створення та розробка технічного завдання' },
  { value: 'CYBERSECURITY', label: 'Кібербезпека' },
  { value: 'OTHER', label: 'Інші роботи з розробки сайтів' },
]

// Поля, які додаються до загальних полів залежно від категорії
export const templates: Record<Category, { name: string; label: string; type: 'text' | 'textarea' | 'number'; placeholder?: string }[]> = {
  WEBSITE_DEVELOPMENT: [
    { name: 'siteType', label: 'Тип сайту (візитка, магазин, портал)', type: 'text', placeholder: 'напр., інтернет-магазин' },
    { name: 'cmsRequired', label: 'Потрібна CMS? Яка?', type: 'text' },
  ],
  LANDING_PAGE: [
    { name: 'sections', label: 'Кількість блоків/секцій', type: 'number' },
  ],
  WEBSITE_REFINEMENT: [
    { name: 'currentUrl', label: 'Адреса поточного сайту', type: 'text' },
    { name: 'requiredChanges', label: 'Що саме потрібно доробити?', type: 'textarea' },
  ],
  MARKUP: [
    { name: 'pages', label: 'Кількість сторінок для верстки', type: 'number' },
    { name: 'designAvailable', label: 'Чи є готовий дизайн-макет?', type: 'text' },
  ],
  QA: [
    { name: 'platform', label: 'Платформа (Web, iOS, Android)', type: 'text' },
    { name: 'testCases', label: 'Є тест-кейси чи потрібно складати?', type: 'textarea' },
  ],
  ONE_C: [
    { name: 'version', label: 'Версія 1С', type: 'text' },
    { name: 'modules', label: 'Необхідні модулі', type: 'textarea' },
  ],
  IT_SERVICES: [
    { name: 'serviceType', label: 'Тип послуги', type: 'text' },
  ],
  MOBILE_APP: [
    { name: 'platforms', label: 'Платформи (iOS, Android, обидві)', type: 'text' },
    { name: 'backend', label: 'Чи потрібна серверна частина?', type: 'text' },
  ],
  GAME_DEV: [
    { name: 'genre', label: 'Жанр гри', type: 'text' },
    { name: 'engine', label: 'Рушій (Unity, Unreal, etc.)', type: 'text' },
  ],
  TECH_SPEC: [
    { name: 'projectDescription', label: 'Опис проекту для ТЗ', type: 'textarea' },
  ],
  CYBERSECURITY: [
    { name: 'scope', label: 'Область перевірки (сайт, мережа)', type: 'text' },
  ],
  OTHER: [],
}
