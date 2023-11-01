import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getConfig } from './getConfig.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import { Config_50009_urn } from '../schemas/Config_50009.js'
import type { ValidationError } from '../converter/ValidationError.js'

void describe('getConfig', () => {
	void it(`should create the LwM2M object 'Config' (50009) from the object '50009' reported by Coiote`, () => {
		const config_coiote = {
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
					value: 60,
				},
				'5': {
					value: 8.5,
				},
				'6': {
					value: true,
				},
				'7': {
					value: false,
				},
				'8': {
					value: 2.5,
				},
				'9': {
					value: 0.5,
				},
			},
		}

		const expected = {
			'0': true,
			'2': 120,
			'3': 600,
			'4': 7200,
			'1': 60,
			'6': true,
			'7': false,
			'5': 8.5,
			'8': 2.5,
			'9': 0.5,
		}

		const config = getConfig(config_coiote) as { result: unknown }
		assert.deepEqual(config.result, expected)
	})

	void it(`should return a warning if the object '50009' reported by Coiote is not defined`, () => {
		const config = getConfig(undefined) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.equal(
			config.error.message,
			`'${Config_50009_urn}' object can not be converted because object id '50009' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition of LwM2M object 50009`, () => {
		const config_coiote = {
			'0': {
				'0': {
					value: true,
				},

				// required value is missing
				// '2': {
				//    value: 120,
				// },

				'3': {
					value: 600,
				},
				'4': {
					value: 7200,
				},
				'1': {
					value: 60,
				},
				'5': {
					value: 8.5,
				},
				'6': {
					value: true,
				},
				'7': {
					value: false,
				},
				'8': {
					value: 2.5,
				},
				'9': {
					value: 0.5,
				},
			},
		}

		const config = getConfig(config_coiote) as {
			error: ValidationError
		}

		const errorMessage = config.error.description[0]?.message
		const keyword = config.error.description[0]?.keyword
		assert.equal(errorMessage, `must have required property '2'`)
		assert.equal(keyword, 'required')
	})
})
