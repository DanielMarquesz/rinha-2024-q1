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