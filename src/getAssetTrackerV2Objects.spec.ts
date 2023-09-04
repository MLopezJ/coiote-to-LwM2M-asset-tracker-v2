import { describe, test as it } from 'node:test'
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
import {
	getAssetTrackerV2Objects,
	assetTrackerObjectsList,
	type assetTrackerObjects,
} from './getAssetTrackerV2Objects.js'

void describe('getAssetTrackerV2Objects', () => {
	void it('should pick objects expected in Asset Tracker v2 LwM2M from input and build a new object from it', async () => {
		const input = {
			'3': {
				'0': {
					'0': {
						value: 'Nordic Semiconductor ASA',
					},
					'1': {
						value: 'Thingy:91',
					},
				},
			},
			'4': {
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
				},
				attributes: {},
			},
			'6': {
				'0': {
					'0': { value: -43.5723 },
					'5': { value: 1665149633 },
					'6': { value: 5 },
				},
			},
			'3315': {
				'0': {
					'5700': {
						value: 101705,
					},
					'5701': {
						value: 'Pa',
					},
				},
			},
			'3303': {
				'0': {
					'5700': {
						value: 15,
					},
				},
			},
			'3304': {
				'0': {
					'5700': {
						value: 30,
					},
				},
			},
			'3323': {
				'0': {
					'5601': {
						value: 101697,
					},
					'5701': {
						value: 'Pa',
					},
				},
			},
			'3347': {
				'0': {
					'5500': {
						value: false,
					},
					'5750': {
						value: 'Button 0',
					},
				},
			},
			'3420': {
				'0': {
					'1': {
						value: '#000000',
					},
				},
			},
			'10256': {
				'0': {
					'0': {
						value: 428,
					},
					'2': {
						value: 6300,
					},
				},
			},
			'50001': {
				'0': {
					'0': {
						value: 5,
					},
					'1': {
						value: 128,
					},
				},
			},
			'50009': {
				'0': {
					'0': {
						value: true,
					},
					'3': {
						value: 600,
					},
					'4': {
						value: 7200,
					},
				},
			},
		}

		// Value of the key don't really matter in this point because no process is happening there
		const expectedOutput = {
			[Device_3_urn]: {},
			[ConnectivityMonitoring_4_urn]: {},
			[Location_6_urn]: {},
			[Temperature_3303_urn]: {},
			[Humidity_3304_urn]: {},
			[Pressure_3323_urn]: {},
			[Config_50009_urn]: {},
		}

		const result = await getAssetTrackerV2Objects(input)
		assert.equal(Object.entries(result).length, assetTrackerObjectsList.length)

		const random = Math.floor(Math.random() * assetTrackerObjectsList.length)
		const requiredAssetTrackerObjectKey = Object.keys(expectedOutput)[
			random
		] as keyof assetTrackerObjects

		// All objects from the expected output should exist in the result
		assert.notEqual(result[`${requiredAssetTrackerObjectKey}`], undefined)
	})
})
