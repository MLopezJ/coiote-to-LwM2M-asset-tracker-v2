import { type Humidity_3304, Humidity_3304_urn } from '../schemas/lwm2m.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'
import {
	getTimestampFromMetadata,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'
import { unwrapMultipleInstance as removeCoioteFormatFrom } from '../coiote/unwrap.js'

/**
 * Build the Humidity object from LwM2M using the object 3304 reported by Coiote
 */
export const getHumidity = (
	metadata: Metadata,
	object?: CoioteFormat,
): ConversionResult<Humidity_3304> => {
	if (object === undefined) return warning(Humidity_3304_urn)

	const maybeHumidity = removeCoioteFormatFrom<Humidity_3304>(object)

	if (
		maybeHumidity[0] !== undefined &&
		maybeHumidity[0]?.[5518] === undefined
	) {
		maybeHumidity[0][5518] = getTimestampFromMetadata(
			Humidity_3304_urn,
			metadata,
		)
	}

	return validateLwM2MFormat(Humidity_3304_urn, maybeHumidity)
}
