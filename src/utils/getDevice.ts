import { Device_3_urn, type Device_3 } from '@nordicsemiconductor/lwm2m-types'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import {
	validateLwM2MFormat,
	type LwM2MFormatError,
} from './validateLwM2MFormat.js'
import type { Instance } from 'src/converter.js'
import { getLwM2MSchemaDefinition } from './getLwM2MSchemaDefinition.js'
import { removeCoioteFormatFromSingleInstanceObj } from './removeCoioteFormatFromSingleInstanceObj.js'

export type getDeviceResult =
	| { result: Device_3 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Convert to LwM2M Device object (id 3) from the object 3 reported by Coiote
 */
export const getDevice = (
	objectWithCoioteFormat?: Instance,
): getDeviceResult => {
	if (objectWithCoioteFormat === undefined)
		return { warning: new UndefinedCoioteObjectWarning(Device_3_urn) }

	const schema = getLwM2MSchemaDefinition(Device_3_urn)
	const device = removeCoioteFormatFromSingleInstanceObj(
		objectWithCoioteFormat,
		schema,
	) as Device_3 // TODO: return the type in the function

	return validateLwM2MFormat(Device_3_urn, device)
}
