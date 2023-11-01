import { describe, it } from 'node:test'
import assert from 'node:assert'
import { unwrapMultipleInstance } from './unwrap.js'

void describe('unwrapMultipleInstance', () => {
	void it(`should remove Coiote format from multiple instance object`, () => {
		const object: Parameters<typeof unwrapMultipleInstance>[0] = {
			'0': {
				'0': {
					value: 1,
				},
				'1': {
					value: 50,
				},
				'7': {
					value: 'U',
				},
				'23': {
					value: false,
				},
			},
			'1': {
				'0': {
					value: 1,
				},
				'1': {
					value: 50,
				},
				'2': {
					'0': {
						value: 0,
					},
					attributes: {
						dim: '1',
					},
				},
				'7': {
					value: 'U',
				},
				'23': {
					value: false,
				},
			},
		}
		const result: ReturnType<typeof unwrapMultipleInstance> = [
			{
				'0': 1,
				'1': 50,
				'7': 'U',
				'23': 0,
			},
			{
				'0': 1,
				'1': 50,
				'2': [0],
				'7': 'U',
				'23': 0,
			},
		]
		assert.deepEqual(unwrapMultipleInstance(object), result)
	})

	void it(`should return undefined when resource does not follow Coiote format`, () => {
		const object = {
			'0': {
				'0': {
					value: 1,
				},
				'1': {}, // uknown format here
			},
			'1': {
				'0': {
					value: 1,
				},
				'1': {
					value: 50,
				},
			},
		} as any
		const result: ReturnType<typeof unwrapMultipleInstance> = [
			{
				'0': 1,
				'1': undefined,
			},
			{
				'0': 1,
				'1': 50,
			},
		]

		assert.deepEqual(unwrapMultipleInstance(object), result)
	})
})
