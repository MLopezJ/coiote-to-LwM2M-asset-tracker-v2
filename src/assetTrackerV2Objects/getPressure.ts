import { type Pressure_3323, Pressure_3323_urn } from '../schemas/lwm2m.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'
import {
	getTimestampFromMetadata,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'
import { unwrapMultipleInstance as removeCoioteFormatFrom } from '../coiote/unwrapMultipleInstance.js'

/**
 * Build the Pressure object from LwM2M using the object 3323 reported by Coiote
 */
export const getPressure = (
	metadata: Metadata,
	object?: CoioteFormat,
): ConversionResult<Pressure_3323> => {
	if (object === undefined) return warning(Pressure_3323_urn)

	const maybePressure = removeCoioteFormatFrom(
		object,
	) as unknown as Pressure_3323

	if (
		maybePressure[0] !== undefined &&
		maybePressure[0]?.[5518] === undefined
	) {
		maybePressure[0][5518] = getTimestampFromMetadata(
			Pressure_3323_urn,
			metadata,
		)
	}

	return validateLwM2MFormat(Pressure_3323_urn, maybePressure)
}
