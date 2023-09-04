import { describe, test as it } from 'node:test'
import assert from 'node:assert'
import { setDataType } from './setDataType.js'
import type { List, Value } from 'src/converter.js'

void describe('setDataType', () => {
	void it('should return string if not data type is specified (default option)', () =>
		assert.equal(setDataType({ value: 1 }), '1'))

	void it('should transform input in array', () => {
		const list = {
			'0': { value: 8 },
			'1': { value: 10 },
			attributes: { dim: '2' },
		}
		const result = setDataType(list)
		assert.deepEqual(result, [8, 10])
		if (Array.isArray(result))
			assert.equal(result.length, Number(list.attributes.dim))
	})

	for (const [input, dataType, expected] of [
		[{ value: 'a' }, 'string', 'a'],
		[{ value: 1 }, 'integer', 1],
		[{ value: 0 }, 'boolean', false],
	]) {
		void it(`should transform '${JSON.stringify(input)}' in ${dataType}`, () =>
			assert.equal(
				setDataType(input as List | Value, dataType as string),
				expected,
			))
	}
})
