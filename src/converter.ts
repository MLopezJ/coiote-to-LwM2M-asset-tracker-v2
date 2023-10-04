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
import { LwM2MFormatError } from './utils/checkLwM2MFormat.js'
import { convertToLwM2M } from './utils/convertToLwM2M.js'
import type { UndefinedCoioteObjectWarning } from './utils/UndefinedCoioteObjectWarning.js'

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
 * Convert 'Coiote Asset Tracker v2' format into 'LwM2M Asset Tracker v2' format
 */
export const converter = async (
	deviceTwin: DeviceTwin,
	onWarning?: (element: UndefinedCoioteObjectWarning) => void,
	onError?: (element: LwM2MFormatError) => void,
): Promise<LwM2MAssetTrackerV2> => {
	const conversionResult = {} as any //as LwM2MAssetTrackerV2
	const deviceTwinData = deviceTwin.properties.reported.lwm2m

	const AssetTrackerV2LwM2MObjects = {
		[Device_3_urn]: convertToLwM2M({
			LwM2MObjectUrn: Device_3_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Device],
		}),
		[ConnectivityMonitoring_4_urn]: convertToLwM2M({
			LwM2MObjectUrn: ConnectivityMonitoring_4_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.ConnectivityMonitoring],
		}),
		[Location_6_urn]: convertToLwM2M({
			LwM2MObjectUrn: Location_6_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Location],
		}),
		[Temperature_3303_urn]: convertToLwM2M({
			LwM2MObjectUrn: Temperature_3303_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Temperature],
		}),
		[Humidity_3304_urn]: convertToLwM2M({
			LwM2MObjectUrn: Humidity_3304_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Humidity],
		}),
		[Pressure_3323_urn]: convertToLwM2M({
			LwM2MObjectUrn: Pressure_3323_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Pressure],
		}),
		[Config_50009_urn]: convertToLwM2M({
			LwM2MObjectUrn: Config_50009_urn as keyof LwM2MAssetTrackerV2,
			coioteObject: deviceTwinData[coioteIds.Config],
		}),
	}

	Object.entries(AssetTrackerV2LwM2MObjects).forEach(
		([objectURN, LwM2MObject]) => {
			if ('result' in LwM2MObject)
				conversionResult[objectURN] = LwM2MObject.result
			else {
				'warning' in LwM2MObject
					? onWarning?.(LwM2MObject.warning)
					: onError?.(LwM2MObject.error as any)
			}
		},
	)

	return conversionResult
}
