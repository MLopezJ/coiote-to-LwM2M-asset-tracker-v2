import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import { validateLwM2MFormat } from './validateLwM2MFormat.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import { unwrapSingleInstance as removeCoioteFormatFrom } from '../coiote/unwrapSingleInstance.js'

/**
 * Convert to LwM2M Connectivity Monitoring object (id 4) from the object 4 reported by Coiote
 */
export const getConnectivityMonitoring = (
	object?: CoioteFormat,
): ConversionResult<ConnectivityMonitoring_4> => {
	if (object === undefined) return warning(ConnectivityMonitoring_4_urn)

	const maybeConnectivityMonitoring =
		removeCoioteFormatFrom<ConnectivityMonitoring_4>(object)

	return validateLwM2MFormat(
		ConnectivityMonitoring_4_urn,
		maybeConnectivityMonitoring,
	)
}
