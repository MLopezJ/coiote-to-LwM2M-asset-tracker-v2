import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	ConnectivityMonitoring_4_urn,
	Device_3_urn,
	Humidity_3304_urn,
	Location_6_urn,
	Pressure_3323_urn,
	Temperature_3303_urn,
} from '@nordicsemiconductor/lwm2m-types'
import { Config_50009_urn } from '../schemas/Config_50009.js'
import { type assetTrackerObjects } from './getAssetTrackerV2Objects.js'
import { removeCoioteFormat } from './removeCoioteFormat.js'

void describe('removeCoioteFormat', () => {
	void it('should build lwm2m format', () => {
		const input: assetTrackerObjects = {
			[Device_3_urn]: {
				'0': {
					'0': {
						value: 'Nordic Semiconductor ASA',
					},
					'1': {
						value: 'Thingy:91',
					},
					'2': {
						value: '351358815340515',
					},
					'3': {
						value: '22.8.1+0',
					},
					'11': {
						'0': {
							value: 0,
						},
						attributes: {
							dim: '1',
						},
					},
					'13': {
						value: 1675874731,
					},
					'16': {
						value: 'UQ',
					},
					'19': {
						value: '3.2.1',
					},
				},
			},
			[ConnectivityMonitoring_4_urn]: {
				'0': {
					'0': {
						value: 6,
					},
					'1': {
						'0': {
							value: 6,
						},
						'1': {
							value: 7,
						},
						attributes: {
							dim: '2',
						},
					},
					'2': {
						value: -85,
					},
					'3': {
						value: 23,
					},
					'4': {
						'0': {
							value: '10.160.120.155',
						},
						attributes: {
							dim: '1',
						},
					},
					'8': {
						value: 34237196,
					},
					'9': {
						value: 2,
					},
					'10': {
						value: 242,
					},
					'12': {
						value: 12,
					},
				},
				attributes: {},
			},
			[Location_6_urn]: {
				'0': {
					'0': { value: -43.5723 },
					'1': { value: 153.2176 },
					'2': { value: 2 },
					'3': {},
					'5': { value: 1665149633 },
					'6': { value: 5 },
				},
			},
			[Temperature_3303_urn]: {
				'0': {
					'5601': {
						value: 27.18,
					},
					'5602': {
						value: 27.71,
					},
					'5700': {
						value: 27.18,
					},
					'5701': {
						value: 'Cel',
					},
				},
			},
			[Humidity_3304_urn]: {
				'0': {
					'5601': {
						value: 23.535,
					},
					'5602': {
						value: 24.161,
					},
					'5700': {
						value: 24.057,
					},
					'5701': {
						value: '%RH',
					},
				},
			},
			[Pressure_3323_urn]: {
				'0': {
					'5601': {
						value: 101697,
					},
					'5602': {
						value: 101705,
					},
					'5700': {
						value: 10,
					},
					'5701': {
						value: 'Pa',
					},
				},
			},
			[Config_50009_urn]: {
				'0': {
					'0': {
						value: true,
					},
					'2': {
						value: 120,
					},
					'3': {
						value: 600,
					},
					'4': {
						value: 7200,
					},
					'1': {
						value: 120,
					},
					'5': {
						value: 8.5,
					},
					'8': {
						value: 2.5,
					},
					'9': {
						value: 0.5,
					},
				},
			},
		}

		const expected = {
			[Device_3_urn]: {
				'0': 'Nordic Semiconductor ASA',
				'1': 'Thingy:91',
				'2': '351358815340515',
				'3': '22.8.1+0',
				'11': [0],
				'13': 1675874731,
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

		const result = removeCoioteFormat(input)

		assert.deepEqual(result, expected)
	})
})
