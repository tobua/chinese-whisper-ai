import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { POST } from './api/transform'

new Elysia().use(cors()).post('/api/transform', POST).listen(3001)

// biome-ignore lint/suspicious/noConsoleLog: indicates that the server has started.
console.log('Local server running!')
