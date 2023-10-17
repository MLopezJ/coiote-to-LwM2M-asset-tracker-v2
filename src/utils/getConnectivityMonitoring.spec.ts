import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getConnectivityMonitoring } from './getConnectivityMonitoring.js'
import type { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { ConnectivityMonitoring_4_urn } from '../schemas/index.js'
import type { Instance } from 'src/converter.js'
import type { LwM2MFormatError } from './validateLwM2MFormat.js'

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
			warning: UndefinedCoioteObjectWarning
		}
		assert.equal(
			connectivityMonitoring.warning.message,
			`'${ConnectivityMonitoring_4_urn}' object can not be converter because object id '4' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the schema definition of LwM2M obejct 4`, () => {
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
			connectivityMonitoring_coiote as unknown as Instance,
		) as {
			error: LwM2MFormatError
		}

		assert.equal(connectivityMonitoring.error.message, 'format error')
	})
})
