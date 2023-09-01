import { describe, it } from 'node:test'
import assert from 'node:assert'
import type { Value } from 'src/converter'
import { checkResource } from './checkResource.js'

void describe('checkResource', () => {
	void it('should return true when required resource value is not undefined', () => {
		const isRequired = true
		const input = { value: 6 }
		assert.equal(checkResource(input, isRequired), true)
	})

	void it('should return false when required resource value is undefined', () => {
		const isRequired = true
		const input = {} as Value
		assert.equal(checkResource(input, isRequired), false)
	})

	void it('should return true when a not required value is not undefined', () => {
		const isRequired = false
		const input = {
			value: false,
		}
		assert.equal(checkResource(input, isRequired), true)
	})

	void it('should return true when a not required value is undefined', () => {
		const isRequired = false
		const input = {} as Value
		assert.equal(checkResource(input, isRequired), true)
	})

	void it('should return true when required resource list is not undefined', () => {
		const isRequired = true
		const input = {
			'0': {
				value: '10.160.120.155',
			},
			attributes: {
				dim: '1',
			},
		}

		assert.equal(checkResource(input, isRequired), true)
	})

	void it('should return false when required resource list is undefined', () => {
		const isRequired = true
		const input = {
			attributes: {
				dim: '0',
			},
		}
		assert.equal(checkResource(input, isRequired), false)
	})

	void it('should return true when no required resource list is not undefined', () => {
		const isRequired = false
		const input = {
			'0': {
				value: '10.160.120.155',
			},
			attributes: {
				dim: '1',
			},
		}

		assert.equal(checkResource(input, isRequired), true)
	})

	void it('should return true when no required resource list is undefined', () => {
		const isRequired = false
		const input = {
			attributes: {
				dim: '0',
			},
		}
		assert.equal(checkResource(input, isRequired), true)
	})
})
