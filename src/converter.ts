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
import { type Config_50009, Config_50009_urn } from './schemas/Config_50009.js'
import { getAssetTrackerV2Objects } from './getAssetTrackerV2Objects.js'
import { removeCoioteFormat } from './removeCoioteFormat.js'
import {
	getMissedAssetTrackerV2Objects,
	Warning,
} from './utils/checkAssetTrackerV2Objects.js'
import { checkLwM2MFormat, LwM2MFormatError } from './utils/checkLwM2MFormat.js'
import { convertToLwM2M } from './utils/convertToLwM2M.js'

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
 * The id of the Asset Tracker v2 objects given by Coiote
 */
const coioteIds = {
	Device: 3,
	ConnectivityMonitoring: 4,
	Location: 6,
	Temperature: 3303,
	Humidity: 3304,
	Pressure: 3323,
	Config: 50009,
}

/**
 * Transform the device twin object coming from Azure to an object with LwM2M objects that are required by Asset Tracker v2
 */
export const converter = async (
	deviceTwin: DeviceTwin,
	onWarning?: (element: Warning) => void,
	onError?: (element: LwM2MFormatError) => void,
): Promise<LwM2MAssetTrackerV2> => {
	const conversionResult = {} as any //as LwM2MAssetTrackerV2
	const deviceTwinData = deviceTwin.properties.reported.lwm2m

	const AssetTrackerV2LwM2MObjects = {
		[Device_3_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Device],
			Device_3_urn,
		),
		[ConnectivityMonitoring_4_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.ConnectivityMonitoring],
			ConnectivityMonitoring_4_urn,
		),
		[Location_6_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Location],
			Location_6_urn,
		),
		[Temperature_3303_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Temperature],
			Temperature_3303_urn,
		),
		[Humidity_3304_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Humidity],
			Humidity_3304_urn,
		),
		[Pressure_3323_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Pressure],
			Pressure_3323_urn,
		),
		[Config_50009_urn]: convertToLwM2M(
			deviceTwinData[coioteIds.Config],
			Config_50009_urn,
		),
	}

	console.log(AssetTrackerV2LwM2MObjects)

	Object.entries(AssetTrackerV2LwM2MObjects).forEach(
		([objectURN, LwM2MObject]) => {
			if ('result' in LwM2MObject)
				conversionResult[objectURN] = LwM2MObject.result
			else {
				'warning' in LwM2MObject
					? onWarning?.(LwM2MObject.warning as any)
					: onError?.(LwM2MObject.error as any)
			}
		},
	)
	console.log(AssetTrackerV2LwM2MObjects)

	const assetTrackerV2LwM2M_coioteFormat = await getAssetTrackerV2Objects(
		deviceTwinData,
	)

	const presentUrns = Object.keys(assetTrackerV2LwM2M_coioteFormat)
	const missedAssetTrackerV2Objects =
		getMissedAssetTrackerV2Objects(presentUrns)
	if (missedAssetTrackerV2Objects.length > 0) {
		onWarning?.(
			new Warning({
				name: 'warning',
				message: 'Missing expected objects',
				missingObjects: missedAssetTrackerV2Objects,
			}),
		)
	}

	const assetTrackerV2LwM2M = removeCoioteFormat(
		assetTrackerV2LwM2M_coioteFormat,
	)

	const validatedLwM2MFormat = checkLwM2MFormat(assetTrackerV2LwM2M) // TODO: rename checkLwM2MFormat. ValidateLwM2MFormat could be an option
	if ('error' in validatedLwM2MFormat) onError?.(validatedLwM2MFormat.error)

	return assetTrackerV2LwM2M
}
