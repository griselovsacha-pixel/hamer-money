/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-render-url.onrender.com'], // додаш свій домен
  },
  // Продакшн-заголовки пізніше в middleware
}

module.exports = nextConfig
