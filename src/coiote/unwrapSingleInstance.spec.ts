import { describe, it } from 'node:test'
import assert from 'node:assert'
import { unwrapSingleInstance } from './unwrapSingleInstance.js'
import type { Instance } from './LwM2MCoioteType.js'

void describe('removeCoioteFormatFromSingleInstanceObj', () => {
	void it('should remove coiote format from single instance object', () => {
		const object = {
			'0': {
				'0': {
					value: 'Nordic Semiconductor ASA',
				},
				'1': {
					value: 'Thingy:91',
				},
				'11': {
					'0': {
						value: 0,
					},
					'1': {
						value: 0,
					},
					attributes: {
						dim: '2',
					},
				},
				'16': {
					value: 'UQ',
				},
			},
		}
		const result = {
			'0': 'Nordic Semiconductor ASA',
			'1': 'Thingy:91',
			'11': [0, 0],
			'16': 'UQ',
		}

		assert.deepEqual(unwrapSingleInstance(object), result)
	})

	void it(`should return undefined when resource does not follow Coiote format`, () => {
		const object = {
			'0': {
				'0': {}, // unknown format here
				'1': {
					value: 'Thingy:91',
				},
				'11': {
					'0': {}, // unknown format here
					'1': {
						value: 0,
					},
					attributes: {
						dim: '2',
					},
				},
				'16': {
					values: 'UQ', // unknown format here
				},
			},
		} as unknown as Instance
		const result = {
			'0': undefined,
			'1': 'Thingy:91',
			'11': [undefined, 0],
			'16': undefined,
		}

		assert.deepEqual(unwrapSingleInstance(object), result)
	})
})
