import type {
	Device_3_urn,
	LwM2MDocument,
} from '@nordicsemiconductor/lwm2m-types'
import { validate } from '@nordicsemiconductor/lwm2m-types'
import type { ConnectivityMonitoring_4_urn, Location_6_urn } from 'src/schemas'

type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

export class LwM2MFormatError extends Error {
	description: ErrorDescription[]

	constructor({
		name,
		message,
		description,
	}: {
		name: string
		message: string
		description: ErrorDescription[]
	}) {
		super()

		this.name = name
		this.message = message
		this.description = description
	}
}

/**
 * Check if input follows the expected data format described by @nordicsemiconductor/lwm2m-types lib
 */
export const checkLwM2MFormat = (
	input: Partial<LwM2MDocument>,
): { result: true } | { error: LwM2MFormatError } => {
	const maybeValidLwM2M = validate(input)
	if ('errors' in maybeValidLwM2M) {
		return {
			error: new LwM2MFormatError({
				name: 'error',
				message: 'format error',
				description: maybeValidLwM2M.errors,
			}),
		}
	}
	return { result: true }
}

/**
 * Validate that object follow the LwM2M definition
 */
export const validateLwM2MFormat = <T>(
	urn:
		| typeof Device_3_urn
		| typeof Location_6_urn
		| typeof ConnectivityMonitoring_4_urn,
	object: T,
): { result: typeof object } | { error: LwM2MFormatError } => {
	const validatedLwM2MObject = validate({ [urn]: object })
	if ('errors' in validatedLwM2MObject) {
		return {
			error: new LwM2MFormatError({
				name: 'error',
				message: 'format error',
				description: validatedLwM2MObject.errors,
			}),
		}
	}
	const obj = validatedLwM2MObject.value[urn] as typeof object
	return { result: obj }
}
