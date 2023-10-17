import { Location_6_urn, type Location_6 } from '../schemas/index.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import {
	validateLwM2MFormat,
	type LwM2MFormatError,
} from './validateLwM2MFormat.js'
import type { Instance } from 'src/converter.js'
import { getLwM2MSchemaDefinition } from './getLwM2MSchemaDefinition.js'
import { removeCoioteFormatFromSingleInstanceObj } from './removeCoioteFormatFromSingleInstanceObj.js'

export type getLocationResult =
	| { result: Location_6 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Convert to LwM2M Location object (id 6) from the object 6 reported by Coiote
 */
export const getLocation = (
	objectWithCoioteFormat?: Instance,
): getLocationResult => {
	if (objectWithCoioteFormat === undefined)
		return { error: new UndefinedCoioteObjectWarning(Location_6_urn) }

	const location = removeCoioteFormatFromSingleInstanceObj(
		objectWithCoioteFormat,
	) as Location_6 // TODO: return the type in the function

	return validateLwM2MFormat(Location_6_urn, location)
}
