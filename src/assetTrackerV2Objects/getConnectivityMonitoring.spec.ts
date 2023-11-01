import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getConnectivityMonitoring } from './getConnectivityMonitoring.js'
import type { ValidationError } from '../converter/ValidationError.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import { ConnectivityMonitoring_4_urn } from '../schemas/lwm2m.js'

void describe('getConnectivityMonitoring', () => {
	void it(`should create the LwM2M object 'Connectivity Monitoring' (4) from the object '4' reported by Coiote`, () => {
		const connectivityMonitoring_coiote = {
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
		}

		const expected = {
			'0': 6,
			'1': [6, 7],
			'2': -85,
			'3': 23,
			'4': ['10.160.120.155'],
			'8': 34237196,
			'9': 2,
			'10': 242,
			'12': 12,
		}

		const connectivityMonitoring = getConnectivityMonitoring(
			connectivityMonitoring_coiote,
		) as { result: unknown }

		assert.deepEqual(connectivityMonitoring.result, expected)
	})

	void it(`should return a warning if the object '4' reported by Coiote is not defined`, () => {
		const connectivityMonitoring = getConnectivityMonitoring(undefined) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.equal(
			connectivityMonitoring.error.message,
			`'${ConnectivityMonitoring_4_urn}' object can not be converted because object id '4' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition of LwM2M object 4`, () => {
		const connectivityMonitoring_coiote = {
			'0': {
				/*
                // required value is missing
				'0': {
					value: 6,
				},
                */
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
		}

		const connectivityMonitoring = getConnectivityMonitoring(
			connectivityMonitoring_coiote as any,
		) as {
			error: ValidationError
		}

		const errorMessage = connectivityMonitoring.error.description[0]?.message
		const keyword = connectivityMonitoring.error.description[0]?.keyword
		assert.equal(errorMessage, `must have required property '0'`)
		assert.equal(keyword, 'required')
	})
})
