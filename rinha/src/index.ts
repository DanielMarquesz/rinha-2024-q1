import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import Pool = require("pg-pool")
import { Client, PoolClient } from 'pg'

const app = new Hono()
const pool = new Pool({
  database: 'rinha',
  user: 'admin',
  password: '123',
  port: 5432,
})

let client: PoolClient & Client
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

  const register = await client.query(`select * from clientes where id = ${id}`)

  if(!register.rowCount) {
    console.log(`User with id: ${id}, not found!`)
    return c.newResponse(null, 404)
  }
  console.log(register.rowCount)
   
  return c.newResponse('ok')
})

