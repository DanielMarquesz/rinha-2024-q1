import Pool = require("pg-pool")
import { Client, PoolClient } from 'pg'

export type TransactionType = {
  id: number
  nome: string
  limite: number
  saldo: number
}


let client: PoolClient & Client

const pool = new Pool({
  database: 'rinha',
  user: 'admin',
  password: '123',
  port: 5432,
})

export const getById = async (id: string) => {
  client = await pool.connect()

  const register = await client.query(`select * from clientes where id = ${id}`)

  if(!register.rowCount) {
    console.log(`User with id: ${id}, not found!`)

    client.release()
    return undefined
  }

  client.release()

  return register.rows[0] as TransactionType
}

export const updateBalanceById = async (id: string, newBalance: number) => {
  client = await pool.connect()

  const result = await client.query(`update clientes set saldo = ${newBalance} where id = ${id}`)

  client.release()

  return result
}

type historyType = {
  client_id: number
  valor: number
  tipo: string
  descricao: string
  createdat: Date
}

export const postHistoryTransaction = async (data: historyType) => {
  client = await pool.connect()
  console.log(data)

  const result = await client.query(`insert into transacoes_historicas (cliente_id, valor, tipo, descricao, createdat) values (${data.client_id},${data.valor}, ${data.tipo}, ${data.descricao}, now())`)
  client.release()

  return result
}