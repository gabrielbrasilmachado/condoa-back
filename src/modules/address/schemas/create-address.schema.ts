import { z } from 'zod'
import { validateZipCode } from '../../../shared/utils/validate-zip-code'

const zipCodeSchema = z
  .string({ error: 'CEP deve ser um texto.' })
  .trim()
  .refine(validateZipCode, 'CEP inválido.')

const addressNameSchema = z
  .string({ error: 'Nome deve ser um texto.' })
  .trim()
  .min(2, 'Nome deve ter pelo menos 2 caracteres.')
  .max(255, 'Nome deve ter no máximo 255 caracteres.')

const addressNumberSchema = z
  .string({ error: 'Número deve ser um texto.' })
  .trim()
  .min(1, 'Número deve ser informado.')
  .max(20, 'Número deve ter no máximo 20 caracteres.')

const addressDistrictSchema = z
  .string({ error: 'Bairro deve ser um texto.' })
  .trim()
  .min(2, 'Bairro deve ter pelo menos 2 caracteres.')
  .max(255, 'Bairro deve ter no máximo 255 caracteres.')

const addressCitySchema = z
  .string({ error: 'Cidade deve ser um texto.' })
  .trim()
  .min(2, 'Cidade deve ter pelo menos 2 caracteres.')
  .max(255, 'Cidade deve ter no máximo 255 caracteres.')

const addressStateSchema = z
  .string({ error: 'Estado deve ser um texto.' })
  .trim()
  .length(2, 'Estado deve ter 2 caracteres.')

const addressComplementSchema = z
  .string({ error: 'Complemento deve ser um texto.' })
  .trim()
  .max(255, 'Complemento deve ter no máximo 255 caracteres.')
  .nullable()
  .optional()

export const createAddressSchema = z
  .object({
    zipCode: zipCodeSchema,
    name: addressNameSchema,
    number: addressNumberSchema,
    district: addressDistrictSchema,
    city: addressCitySchema,
    state: addressStateSchema,
    complement: addressComplementSchema,
    condominiumId: z.uuid('CondominiumId deve ser um UUID válido.'),
  })
  .strict()

export type CreateAddressInput = z.input<typeof createAddressSchema>
export type CreateAddressData = z.output<typeof createAddressSchema>
