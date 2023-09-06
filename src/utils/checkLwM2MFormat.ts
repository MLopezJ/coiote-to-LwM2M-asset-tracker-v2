import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import { validate } from '@nordicsemiconductor/lwm2m-types'

type ErrorDescription = {
	instancePath: string
	schemaPath: string
	keyword: string
	params: Record<string, unknown>
	message?: string
}

export class LwM2MFormatError extends Error {
	override name: string
	override message: string
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
