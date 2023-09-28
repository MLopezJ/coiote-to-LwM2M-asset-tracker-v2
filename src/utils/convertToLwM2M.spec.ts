import { describe, it } from 'node:test'
import assert from 'node:assert'
import { convertToLwM2M } from './convertToLwM2M.js'
import { Device_3_urn } from '@nordicsemiconductor/lwm2m-types'
import type { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import type { LwM2MFormatError } from './checkLwM2MFormat.js'

void describe('convertToLwM2M', () => {
	void it('should return warning if object is undefined', () => {
		const expected = `'${Device_3_urn}' object can not be converter because object id '3' is undefined in input received`

		const result = convertToLwM2M({
			LwM2MObjectUrn: Device_3_urn,
			coioteObject: undefined,
		}) as {
			warning: UndefinedCoioteObjectWarning
		}
		assert.deepEqual(result.warning.message, expected)
	})

	void it('should return error if conversion from coiote format to LwM2M is not successful', () => {
		/**
		 * Device object in Coiote Format with a format error
		 */
		const input = {
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
					// this should be array
					value: 1675874731,
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

		const result = convertToLwM2M({
			LwM2MObjectUrn: Device_3_urn,
			coioteObject: input,
		}) as {
			error: LwM2MFormatError
		}
		const instancePathError = result.error.description[0]?.instancePath
		const message = result.error.description[0]?.message
		assert.equal(instancePathError, `/${Device_3_urn}/11`)
		assert.equal(message, 'must be array')
	})

	void it('should return the object with LwM2M format', () => {
		/**
		 * Device object in Coiote Format
		 */
		const input = {
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

		/**
		 * Device object in LwM2M Format
		 */
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

		const { result } = convertToLwM2M({
			LwM2MObjectUrn: Device_3_urn,
			coioteObject: input,
		}) as {
			result: unknown
		}
		assert.deepEqual(result, expected)
	})
})
