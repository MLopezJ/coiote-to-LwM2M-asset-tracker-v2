import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import {
	isSingleInstance,
	type Instance as CoioteFormat,
} from '../coiote/LwM2MCoioteType.js'
import { unwrapSingleInstance as removeCoioteFormatFrom } from '../coiote/unwrap.js'

/**
 * Convert to LwM2M Device object (id 3) from the object 3 reported by Coiote
 */
export const getDevice = (
	object?: CoioteFormat,
): ConversionResult<Device_3> => {
	if (!isSingleInstance(object)) return warning(Device_3_urn)

	const maybeDevice = removeCoioteFormatFrom<Device_3>(object)

	return validateLwM2MFormat(Device_3_urn, maybeDevice)
}
