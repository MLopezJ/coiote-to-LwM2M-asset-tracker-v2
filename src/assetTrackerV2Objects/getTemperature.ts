import {
	Temperature_3303_urn,
	type Temperature_3303,
} from '../schemas/lwm2m.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import {
	getTimestampFromMetadata,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'
import { unwrapMultipleInstance as removeCoioteFormatFrom } from '../coiote/unwrapMultipleInstance.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'

/**
 * Build the Temperature object from LwM2M using the object 3303 reported by Coiote
 */
export const getTemperature = (
	metadata: Metadata,
	object?: CoioteFormat,
): ConversionResult<Temperature_3303> => {
	if (object === undefined) return warning(Temperature_3303_urn)

	const maybeTemperature = removeCoioteFormatFrom(
		object,
	) as unknown as Temperature_3303

	if (
		maybeTemperature[0] !== undefined &&
		maybeTemperature[0]?.[5518] === undefined
	)
		maybeTemperature[0][5518] = getTimestampFromMetadata(
			Temperature_3303_urn,
			metadata,
		)

	return validateLwM2MFormat(Temperature_3303_urn, maybeTemperature)
}
