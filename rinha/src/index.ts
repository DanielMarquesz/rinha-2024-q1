import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import Pool = require("pg-pool")

const app = new Hono()
const pool = new Pool({
  database: 'rinha',
  user: 'admin',
  port: 5432,
})

let client
const port = (process.env.PORT || 3000) as number

serve({
  ...app,
  port,
}, async () => {
  console.log(`Listening on port: ${port}`)
  client = await pool.connect()
  console.log((await client.query('select * from clientes')).rows)
})

app.get('/clientes/:id/extrato', (c) => {
  console.log('GET')
  const response = {
    name: 'Daniel'
  }
  return c.newResponse(JSON.stringify(response) ,201)
})

app.post('clientes/:id/transacoes', async (c) => {
  const body = await c.req.json()
  const id = c.req.param('id')
  console.log('asdadasd')
   
  return c.newResponse('ok')
})

