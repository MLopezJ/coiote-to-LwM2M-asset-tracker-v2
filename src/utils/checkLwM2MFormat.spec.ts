import { describe, it } from 'node:test'
import assert from 'node:assert'
import { Device_3_urn, Location_6_urn } from '../schemas/index.js'
import {
	LwM2MFormatError,
	validateLwM2MFormat,
} from './checkLwM2MFormat.js'

void describe('validateLwM2MFormat', () => {
	void it('should return object if it has the LwM2M struct', () => {
		const location = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'5': 1665149633,
			'6': 5,
		}
		const expected = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'5': 1665149633,
			'6': 5,
		}
		const check = validateLwM2MFormat(Location_6_urn, location) as {
			result: unknown
		}
		assert.deepEqual(check.result, expected)
	})

	void it('should return an error when the LwM2M object has wrong data type on its resources', () => {
		const object = {
			'0': 1, // expecting string
			'1': '2', // expecting string
			'2': '456', // expecting string
			'3': '22.8.1+0',
			'11': [11],
			'13': 123456,
			'16': 'UQ',
			'19': '3.2.1',
		}

		const check = validateLwM2MFormat(Device_3_urn, object) as {
			error: LwM2MFormatError
		}

		const instancePathError = check.error.description[0]?.instancePath
		const message = check.error.description[0]?.message
		assert.equal(instancePathError, `/${Device_3_urn}/0`)
		assert.equal(message, 'must be string')
	})
})
