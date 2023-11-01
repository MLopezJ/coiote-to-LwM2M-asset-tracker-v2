import { validate, type LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import { ValidationError } from '../converter/ValidationError.js'

/**
 * Validate that object follow the LwM2M definition
 */
export const validateLwM2MFormat = <T>(
	urn: keyof LwM2MDocument,
	object: T,
): { result: typeof object } | { error: ValidationError } => {
	const validatedLwM2MObject = validate({ [urn]: object })
	if ('errors' in validatedLwM2MObject)
		return {
			error: new ValidationError(validatedLwM2MObject.errors),
		}

	const obj = validatedLwM2MObject.value[urn] as typeof object
	return { result: obj }
}
