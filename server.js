const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const jwt = require('jsonwebtoken') // потрібно встановити: npm install jsonwebtoken

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  })

  // Middleware для перевірки JWT при підключенні
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) return next(new Error('Authentication error'))
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET)
      socket.userId = decoded.id
      next()
    } catch (err) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId)

    // Приєднання до кімнат діалогів
    socket.on('join_room', (conversationId) => {
      socket.join(conversationId)
    })

    // Відправка повідомлення
    socket.on('send_message', async (data) => {
      const { conversationId, content, receiverId } = data
      // Зберігаємо в БД
      const { PrismaClient } = require('@prisma/client')
      const prisma = new PrismaClient()
      try {
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.userId,
            content,
          },
          include: { sender: { select: { id: true, name: true, image: true } } }
        })
        // Розсилаємо повідомлення всім у кімнаті
        io.to(conversationId).emit('new_message', message)
        // Також сповіщення отримувачу (якщо він не в кімнаті) можна окремо
      } catch (e) {
        console.error(e)
      } finally {
        await prisma.$disconnect()
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId)
    })
  })

  // Робимо io доступним у застосунку Next.js
  app.set('io', io)

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
