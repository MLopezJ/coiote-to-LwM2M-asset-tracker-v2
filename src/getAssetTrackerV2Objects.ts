import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	getURN,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from './schemas/Config_50009.js'

import type { LwM2MCoiote, Instance } from './converter.js'

// list of objects needed to build Asset Tracker object
export const assetTrackerObjectsList = [
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
	Config_50009_urn,
]

export type assetTrackerObjects = {
	[ConnectivityMonitoring_4_urn]: Instance
	[Device_3_urn]: Instance
	[Humidity_3304_urn]: Instance
	[Location_6_urn]: Instance
	[Pressure_3323_urn]: Instance
	[Temperature_3303_urn]: Instance
	[Config_50009_urn]: Instance
}

/**
 * Pick from input the expected objects in Asset Tracker v2 LwM2M,
 * transform id for those objects who belong to LwM2M
 * and return a list of new objects with respective value
 */
export const getAssetTrackerV2Objects = async (
	input: LwM2MCoiote,
): Promise<assetTrackerObjects> => {
	const requiredObjects = Object.entries(input).map(
		async ([objectId, value]) => {
			const urn = await getURN(objectId)

			if (urn === undefined) {
				if (assetTrackerObjectsList.includes(objectId) === true)
					return { [`${objectId}`]: value }
			} else {
				if (assetTrackerObjectsList.includes(urn) === true)
					return { [`${urn}`]: value }
			}
			return undefined
		},
	)

	return (await Promise.all(requiredObjects))
		.filter((obj) => obj !== undefined) // remove empty values
		.reduce(
			(previous, current) =>
				// make it an object
				({ ...current, ...previous }),
			{},
		) as assetTrackerObjects
}
