import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { getById, postHistoryTransaction, updateBalanceById } from './repository'
import { transactionValidation } from './validator'

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

app.get('/clientes/:id/extrato', async (c) => {
  console.log('GET')

  const id = c.req.param('id')

  const result = await getById(id)

  if(!result) {
    console.log('Extrato not found!')
    return c.newResponse(null, 404)
  }


  const response = {
    saldo: {
      total: result.saldo,
      data_extrato: new Date(),
      limite: result.limite
    },
    ultimas_transacoes: []
  }

  console.log(new Date())
  return c.newResponse(JSON.stringify(response) ,201)
})

app.post('clientes/:id/transacoes', async (c) => {
  const body = await c.req.json()
  const id = c.req.param('id')

  console.log(body)

  try {
    const data = await transactionValidation.validateAsync(body)
    console.log(data)
  } catch (error) {
    console.log(error)

    return c.newResponse(null, 422)
  }

  const register = await getById(id)

  if(!register) {
    return c.newResponse(null, 404)    
  }

  console.log(register)

  if(body.tipo === 'd') {


  const diff = body.valor - register.saldo
  console.log("Diff", diff)

  const newLimit = register.limite - diff
  const newSaldo = register.saldo - body.valor

  console.log('Novo saldo', newSaldo)
  const newBalance = register.saldo- body.valor
  // Caso o limite vá ficar negativo

    if(newBalance <= (register.limite * -1)) {

      console.log('new Limit', newLimit)
      console.log('The limit cannot be negative!')

      return c.newResponse(null, 422)
    }

    console.log('Tem limite suficiente')

    console.log('Updating balance')

    await updateBalanceById(id, newBalance)

    console.log('Creating History')

    await postHistoryTransaction({
      client_id: Number(id),
      createdat: new Date(),
      descricao: 'descricao',
      tipo: 'c',
      valor: newBalance
    })

    return c.newResponse(JSON.stringify({
      limite: register.limite,
      saldo: newBalance
    }), 200)
  }
     
  return c.newResponse('Success', 204)
})

