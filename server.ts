import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { POST } from './api/transform'

new Elysia().use(cors()).post('/api/transform', POST).listen(3001)

console.log('Local server running!')
