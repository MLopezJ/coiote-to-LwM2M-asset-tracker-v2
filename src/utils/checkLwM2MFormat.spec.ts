import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
	Device_3_urn,
	Location_6_urn,
	type LwM2MDocument,
} from '@nordicsemiconductor/lwm2m-types'
import { checkLwM2MFormat } from './checkLwM2MFormat.js'

void describe('checkLwM2MFormat', () => {
	void it('should return true if object has the LwM2M struct', () => {
		const input = {
			[Location_6_urn]: {
				'0': -43.5723,
				'1': 153.2176,
				'2': 2,
				'5': 1665149633,
				'6': 5,
			},
		}
		const check = checkLwM2MFormat(input) as { result: true }
		assert.equal(check.result, true)
	})

	void it('should return an error when the LwM2M object has wrong data type on its resources', () => {
		const input = {
			[Device_3_urn]: {
				'0': 1, // expecting string
				'1': 2, // expecting string
				'2': 456, // expecting string
				'3': '22.8.1+0',
				'11': '0', // expecting number
				'13': 'a', // expecting number
				'16': 'UQ',
				'19': '3.2.1',
			},
		}

		const check = checkLwM2MFormat(
			input as unknown as Partial<LwM2MDocument>,
		) as { error: Error }
		assert.notEqual(check.error, undefined)
	})
})
