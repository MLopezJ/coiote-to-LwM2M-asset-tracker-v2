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
import { Config_50009_urn } from './../../schemas/Config_50009.js'

import { checkAssetTrackerV2Objects } from './checkAssetTrackerV2Objects.js'

void describe('checkAssetTrackerV2Objects', () => {
	void it('Should return a warning if the list has not the expected LwM2M elements', () => {
		const input = [
			ConnectivityMonitoring_4_urn,
			Device_3_urn,
			Humidity_3304_urn,
			// Location_6_urn, Location is missing in input
			//Pressure_3323_urn, // Pressure object is missing in input
			Temperature_3303_urn,
			Config_50009_urn,
		]
		const result = checkAssetTrackerV2Objects(input) as { warning: Error }
		assert.notEqual(result.warning, undefined)
	})

	void it('Should return true if the list has all the expected LwM2M elements', () => {
		const input = [
			ConnectivityMonitoring_4_urn,
			Device_3_urn,
			Humidity_3304_urn,
			Location_6_urn,
			Pressure_3323_urn,
			Temperature_3303_urn,
			Config_50009_urn,
		]
		const result = checkAssetTrackerV2Objects(input) as { result: true }
		assert.equal(result.result, true)
	})
})
