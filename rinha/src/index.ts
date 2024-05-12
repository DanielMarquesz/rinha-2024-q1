import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { getById } from './repository'

const app = new Hono()

// let client: PoolClient & Client
const port = (process.env.PORT || 3000) as number

serve({
  ...app,
  port,
}, async () => {
  console.log(`Listening on port: ${port}`)
  // client = await pool.connect()
  // console.log((await client.query('select * from clientes')).rows)
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

  console.log('AQUI', id)

  const register = await getById(id)

  if(!register) {
    return c.newResponse(null, 404)    
  }

  let limitAfterRequest: number
  let saldoAfterRequest = register.saldo - body.valor

  console.log(register)

  if(body.tipo === 'd') {

    // Se o saldo atual é menor do que a solicitação.
    if(register.saldo <= body.valor) {
      const diff = body.valor - register.saldo
      console.log("Diff", diff)

      const newLimit = register.limite - diff
      const newSaldo = register.saldo - body.valor

      console.log('Novo saldo', newSaldo)
      
      // Caso o limite vá ficar negativo
      if(newLimit < register.limite && newSaldo < 0) {
        console.log('new Limit', newLimit)
        console.log('The limit cannot be negative!')
        return c.newResponse(null, 422) 
      }

      console.log('Tem limite suficiente')
      // Caso ele tenha saldo suficiente para a ooperação de débito,
      // Realizar o saque, e salvar o novo valor na base

      register.saldo = register.saldo- body.valor
      console.log(register)
      // limitAfterRequest
    }
  }




  const response = {
    limite: register.limite - body
  }

  console.log(register)
   
  return c.newResponse('ok')
})

