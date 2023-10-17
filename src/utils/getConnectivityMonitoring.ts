import {
	type ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import {
	validateLwM2MFormat,
	type LwM2MFormatError,
} from './validateLwM2MFormat.js'
import type { Instance } from 'src/converter.js'
import { getLwM2MSchemaDefinition } from './getLwM2MSchemaDefinition.js'
import { removeCoioteFormatFromSingleInstanceObj } from './removeCoioteFormatFromSingleInstanceObj.js'

export type getConnectivityMonitoringResult =
	| { result: ConnectivityMonitoring_4 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Convert to LwM2M Connectivity Monitoring object (id 4) from the object 4 reported by Coiote
 */
export const getConnectivityMonitoring = (
	objectWithCoioteFormat?: Instance,
): getConnectivityMonitoringResult => {
	if (objectWithCoioteFormat === undefined)
		return {
			warning: new UndefinedCoioteObjectWarning(ConnectivityMonitoring_4_urn),
		}

	const schema = getLwM2MSchemaDefinition(ConnectivityMonitoring_4_urn)
	const connectivityMonitoring = removeCoioteFormatFromSingleInstanceObj(
		objectWithCoioteFormat,
		schema,
	) as ConnectivityMonitoring_4 // TODO: return the type in the function

	return validateLwM2MFormat(
		ConnectivityMonitoring_4_urn,
		connectivityMonitoring,
	)
}
