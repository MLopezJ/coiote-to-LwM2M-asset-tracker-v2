import { Location_6_urn, type Location_6 } from '../schemas/lwm2m.js'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import { unwrapSingleInstance as removeCoioteFormatFrom } from '../coiote/unwrapSingleInstance.js'

/**
 * Convert to LwM2M Location object (id 6) from the object 6 reported by Coiote
 */
export const getLocation = (
	object?: CoioteFormat,
): ConversionResult<Location_6> => {
	if (object === undefined) return warning(Location_6_urn)

	const maybeLocation = removeCoioteFormatFrom<Location_6>(object)

	return validateLwM2MFormat(Location_6_urn, maybeLocation)
}
