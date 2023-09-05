import type {
	ConnectivityMonitoring_4,
	ConnectivityMonitoring_4_urn,
	Device_3,
	Device_3_urn,
	Humidity_3304,
	Humidity_3304_urn,
	Location_6,
	Location_6_urn,
	Pressure_3323,
	Pressure_3323_urn,
	Temperature_3303,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { type Config_50009, Config_50009_urn } from './schemas/Config_50009.js'

import { type assetTrackerObjects } from './getAssetTrackerV2Objects.js'
import { setCustomFormat } from './utils/setCustomFormat.js'
import { setLwM2MFormat } from './utils/setLwM2MFormat.js'

export type AssetTrackerLwM2MFormat = {
	[ConnectivityMonitoring_4_urn]: ConnectivityMonitoring_4
	[Device_3_urn]: Device_3
	[Humidity_3304_urn]: Humidity_3304
	[Location_6_urn]: Location_6
	[Pressure_3323_urn]: Pressure_3323
	[Temperature_3303_urn]: Temperature_3303
	[Config_50009_urn]: Config_50009
}

/**
 * Remove coiote format from instances and set the LwM2M format as described in each object schema
 */
export const removeCoioteFormat = (
	input: assetTrackerObjects,
): AssetTrackerLwM2MFormat => {
	const result = Object.entries(input).reduce((previous, [objectId, value]) => {
		if (objectId === Config_50009_urn) {
			return {
				...previous,
				...setCustomFormat({ [`${objectId}`]: value }),
			}
		}

		return {
			...previous,
			...setLwM2MFormat({ [`${objectId}`]: value }),
		}
	}, {})

	return result as AssetTrackerLwM2MFormat
}
