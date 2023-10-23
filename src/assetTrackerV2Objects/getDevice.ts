import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { warning } from '../utils/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from '../utils/validateLwM2MFormat.js'
import type {
	ConversionResult,
	Instance as CoioteFormat,
} from 'src/converter.js'
import { removeCoioteFormatFromSingleInstanceObj as removeCoioteFormatFrom } from '../utils/removeCoioteFormatFromSingleInstanceObj.js'

/**
 * Convert to LwM2M Device object (id 3) from the object 3 reported by Coiote
 */
export const getDevice = (
	object?: CoioteFormat,
): ConversionResult<Device_3> => {
	if (object === undefined) return warning(Device_3_urn)

	const maybeDevice = removeCoioteFormatFrom(object)

	return validateLwM2MFormat(Device_3_urn, maybeDevice as Device_3)
}