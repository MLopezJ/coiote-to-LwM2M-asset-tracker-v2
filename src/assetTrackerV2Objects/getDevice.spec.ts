import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getDevice } from './getDevice.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import { Device_3_urn } from '../schemas/lwm2m.js'
import type { Instance } from '../coiote/LwM2MCoioteType.js'
import { ValidationError } from '../converter/ValidationError.js'

void describe('getDevice', () => {
	void it(`should create the LwM2M object 'Device' (3) from the object '3' reported by Coiote`, () => {
		const device_coiote = {
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
				'7': {
					'0': {
						value: 80,
					},
					attributes: {
						dim: '1',
					},
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
		}

		const expected = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'2': '351358815340515',
			'3': '22.8.1+0',
			'7': [80],
			'11': [0],
			'13': 1675874731,
			'16': 'UQ',
			'19': '3.2.1',
		}

		const device = getDevice(device_coiote) as { result: unknown }
		assert.deepEqual(device.result, expected)
	})

	void it(`should return a warning if the object '3' reported by Coiote is not defined`, () => {
		const device = getDevice(undefined) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.equal(
			device.error.message,
			`'${Device_3_urn}' object can not be converted because object id '3' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition of LwM2M object 3`, () => {
		const device_coiote = {
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
				'7': {
					'0': {
						value: 80,
					},
					attributes: {
						dim: '1',
					},
				},
				'11': {
					value: 1675874731, // this is an error
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
		}

		const device = getDevice(device_coiote as unknown as Instance) as {
			error: ValidationError
		}

		const errorMessage = device.error.description[0]?.message
		const keyword = device.error.description[0]?.keyword
		assert.equal(errorMessage, `must be array`)
		assert.equal(keyword, 'type')
	})
})
