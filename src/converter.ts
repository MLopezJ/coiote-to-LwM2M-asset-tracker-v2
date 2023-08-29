import {
	Device_3_urn,
	ConnectivityMonitoring_4_urn,
	Location_6_urn,
	Temperature_3303_urn,
	Humidity_3304_urn,
	Pressure_3323_urn,
} from '@nordicsemiconductor/lwm2m-types'
import type {
	Device_3,
	ConnectivityMonitoring_4,
	Location_6,
	Temperature_3303,
	Humidity_3304,
	Pressure_3323,
} from '@nordicsemiconductor/lwm2m-types'
import { type Config_50009, Config_50009_urn } from '../schemas/Config_50009.js'
import { getAssetTrackerV2Objects } from './getAssetTrackerV2Objects.js'
import { removeCoioteFormat } from './removeCoioteFormat.js'
import { checkAssetTrackerV2Objects } from './utils/checkAssetTrackerV2Objects.js'
import { checkLwM2MFormat } from './utils/checkLwM2MFormat.js'

export type Value = { value: string | number | boolean }
export type List = Record<string, { dim: string } | Value>
export type Resource = { [key: string]: Value | List }
type instanceId = string
export type Instance = Record<instanceId, Resource>
type objectId = string
export type LwM2MCoiote = Record<objectId, Instance>

export type DeviceTwin = {
	properties: {
		desired: unknown
		reported: {
			lwm2m: LwM2MCoiote
			$metadata: unknown
			$version: number
		}
	}
}

/**
 * Expected output format
 */
export type LwM2MAssetTrackerV2 = {
	[Device_3_urn]?: Device_3
	[ConnectivityMonitoring_4_urn]?: ConnectivityMonitoring_4
	[Location_6_urn]?: Location_6
	[Temperature_3303_urn]?: Temperature_3303
	[Humidity_3304_urn]?: Humidity_3304
	[Pressure_3323_urn]?: Pressure_3323
	[Config_50009_urn]?: Config_50009
}

/**
 * Transform the device twin object coming from Azure to an object with LwM2M objects that are required by Asset Tracker v2
 */
export const converter = async (
	deviceTwin: DeviceTwin,
	onWarning?: (element: unknown) => void,
	onError?: (element: unknown) => void,
): Promise<LwM2MAssetTrackerV2> => {
	const coioteLwM2M = deviceTwin.properties.reported.lwm2m
	const objects = await getAssetTrackerV2Objects(coioteLwM2M)

	const expectedObjects = checkAssetTrackerV2Objects(Object.keys(objects))
	if ('warning' in expectedObjects) onWarning?.(expectedObjects.warning) // TODO: return warning

	const LwM2MAssetTrackerV2 = removeCoioteFormat(objects)

	const LwM2MFormat = checkLwM2MFormat(LwM2MAssetTrackerV2)
	if ('error' in LwM2MFormat) onError?.(LwM2MFormat.error) // TODO: return error

	return LwM2MAssetTrackerV2
}
