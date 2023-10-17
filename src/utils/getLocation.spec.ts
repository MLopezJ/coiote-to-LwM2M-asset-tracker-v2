import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getLocation } from './getLocation.js'
import type { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { Location_6_urn } from '../schemas/index.js'
import type { Instance } from 'src/converter.js'
import type { LwM2MFormatError } from './validateLwM2MFormat.js'

void describe('getLocation', () => {
	void it(`should create the LwM2M object 'Location' (6) from the object '6' reported by Coiote`, () => {
		const location_coiote = {
			'0': {
				'0': { value: -43.5723 },
				'1': { value: 153.2176 },
				'2': { value: 2 },
				'3': { value: 24.798573 },
				'5': { value: 1665149633 },
				'6': { value: 5 },
			},
		}

		const expected = {
			'0': -43.5723,
			'1': 153.2176,
			'2': 2,
			'3': 24.798573,
			'5': 1665149633,
			'6': 5,
		}

		const location = getLocation(location_coiote) as {
			result: unknown
		}
		assert.deepEqual(location.result, expected)
	})

	void it(`should return a warning if the object '6' reported by Coiote is not defined`, () => {
		const location = getLocation(undefined) as {
			warning: UndefinedCoioteObjectWarning
		}
		assert.equal(
			location.warning.message,
			`'${Location_6_urn}' object can not be converter because object id '6' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition of LwM2M obejct 6`, () => {
		const location_coiote = {
			'0': {
				// '0': { value: -43.5723 }, required value is missing
				'1': { value: 153.2176 },
				'2': { value: 2 },
				'3': { value: 24.798573 },
				'5': { value: 1665149633 },
				'6': { value: 5 },
			},
		}

		const location = getLocation(location_coiote as unknown as Instance) as {
			error: LwM2MFormatError
		}

		assert.equal(location.error.message, 'format error')
	})
})
