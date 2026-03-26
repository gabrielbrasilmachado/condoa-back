import { z, type ZodError } from 'zod'

type FormattedZodError = {
  message: string
  issues: ReturnType<typeof z.flattenError>['fieldErrors']
  formErrors: ReturnType<typeof z.flattenError>['formErrors']
}

export const formatZodError = (error: ZodError): FormattedZodError => {
  const flattened = z.flattenError(error)

  return {
    message: 'Dados de entrada inválidos.',
    issues: flattened.fieldErrors,
    formErrors: flattened.formErrors,
  }
}
