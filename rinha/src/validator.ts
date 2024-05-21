import Joi from 'joi'

export const transactionValidation = Joi.object({
  valor: Joi.number().positive(),
  tipo: Joi.string().valid('c', 'd'),
  descricao: Joi.string().max(10)
}).required()