import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from '../schemas/Config_50009.js'
import { getAssetTrackerObjects } from './getAssetTrackerObjects.js'

export type value = { value: string | number | boolean }
export type list = Record<string, { dim: string } | value>
export type attribute = { attributes: { dim: string } }
export type resource = { [key: string]: value | list }
type instanceId = string
export type instance = Record<instanceId, resource>
type objectId = string
export type lwm2mCoiote = Record<objectId, instance>

export type deviceTwin = {
	properties: {
		desired: unknown
		reported: {
			lwm2m: lwm2mCoiote
			$metadata: unknown
			$version: number
		}
	}
}

/**
 * Main object of the process.
 * Transform the device twin coming from Azure to the expected input in Asset Tracker web app
 */
export const converter = async (deviceTwin: deviceTwin): Promise<any> => {
	const input = deviceTwin.properties.reported.lwm2m
	//console.log(input)
	const objects = await getAssetTrackerObjects(input)
	console.log(objects)
	/*
	
	const assetTrackerLwM2M = removeCoioteFormat(objects)

	checkLwM2MFormat(assetTrackerLwM2M)

	return assetTrackerLwM2M
    */
	return {
		[Device_3_urn]: {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'11': [0],
			'13': 1675874731000,
			'16': 'UQ',
			'19': '3.2.1',
		},

		[ConnectivityMonitoring_4_urn]: {
			'0': 6,
			'1': [6, 7],
			'2': -85,
			'3': 23,
			'4': ['10.160.120.155'],
			'8': 34237196,
			'9': 2,
			'10': 242,
			'12': 12,
		},

		[Location_6_urn]: {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'5': 1665149633,
			'6': 5,
		},

		[Temperature_3303_urn]: [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
			},
		],

		[Humidity_3304_urn]: [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
			},
		],

		[Pressure_3323_urn]: [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
			},
		],

		[Config_50009_urn]: {
			'0': true,
			'2': 120,
			'3': 600,
			'4': 7200,
			'1': 120,
			'5': 8.5,
			'8': 2.5,
			'9': 0.5,
		},
	}
}
