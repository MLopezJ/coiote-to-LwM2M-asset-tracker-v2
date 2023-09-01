import { describe, it } from 'node:test'
import assert from 'node:assert'
import { convertToLwM2MArrayInstance } from './convertToLwM2MArrayInstance.js'

void describe('convertToLwM2MArrayInstance', () => {
	void it(`should convert list using array type definition schema`, () => {
		const schema = {
			type: 'array',
			minItems: 1,
			title: 'LwM2M Server',
			description:
				'This LwM2M Objects provides the data related to a LwM2M Server.',
			items: {
				type: 'object',
				$id: 'https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/1.xml',
				title: 'LwM2M Server',
				description:
					'This LwM2M Objects provides the data related to a LwM2M Server',
				additionalProperties: false,
				properties: {
					'0': {
						type: 'integer',
						minimum: 1,
						maximum: 65534,
						title: 'Short Server ID',
						description: 'Used as link to associate server Object Instance.',
					},
					'1': {
						type: 'integer',
						title: 'Lifetime',
						description:
							'Specify the lifetime of the registration in seconds (see Client Registration Interface). If the value is set to 0, the lifetime is infinite. Units: s.',
					},
					'7': {
						type: 'string',
						title: 'Binding',
						description:
							'The possible values are those listed in the LwM2M Core Specification. This Resource defines the transport binding configured for the LwM2M Client.\r\nIf the LwM2M Client supports the binding specified in this Resource, the LwM2M Client MUST use that transport for the Current Binding Mode.',
					},
					'23': {
						type: 'integer',
						minimum: 0,
						maximum: 1,
						title: 'Mute Send',
						description:
							'If true or the Resource is not present, the LwM2M Client Send command capability is de-activated. \r\nIf false, the LwM2M Client Send Command capability is activated.',
					},
				},
				required: ['0', '1'],
			},
		}
		const object = {
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
				'7': {
					value: 'U',
				},
				'23': {
					value: false,
				},
			},
		}
		const result = [
			{
				'0': 1,
				'1': 50,
				'7': 'U',
				'23': 0,
			},
			{
				'0': 1,
				'1': 50,
				'7': 'U',
				'23': 0,
			},
		]
		assert.deepEqual(convertToLwM2MArrayInstance(object, schema), result)
	})

	void it(`should remove empty values when they are not required in schema definition`, () => {
		const schema = {
			type: 'array',
			minItems: 1,
			title: 'LwM2M Server',
			description:
				'This LwM2M Objects provides the data related to a LwM2M Server.',
			items: {
				type: 'object',
				$id: 'https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/1.xml',
				title: 'LwM2M Server',
				description:
					'This LwM2M Objects provides the data related to a LwM2M Server',
				additionalProperties: false,
				properties: {
					'0': {
						type: 'integer',
						minimum: 1,
						maximum: 65534,
						title: 'Short Server ID',
						description: 'Used as link to associate server Object Instance.',
					},
					'1': {
						type: 'integer',
						title: 'Lifetime',
						description:
							'Specify the lifetime of the registration in seconds (see Client Registration Interface). If the value is set to 0, the lifetime is infinite. Units: s.',
					},
				},
				required: ['0'],
			},
		}
		const object = {
			'0': {
				'0': {
					value: 1,
				},
				'1': {},
			},
		}
		const result = [
			{
				'0': 1,
			},
		]

		assert.deepEqual(convertToLwM2MArrayInstance(object, schema), result)
	})

	void it(`should return undefined when a required value is not defined`, () => {
		const schema = {
			type: 'array',
			minItems: 1,
			title: 'LwM2M Server',
			description:
				'This LwM2M Objects provides the data related to a LwM2M Server.',
			items: {
				type: 'object',
				$id: 'https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/1.xml',
				title: 'LwM2M Server',
				description:
					'This LwM2M Objects provides the data related to a LwM2M Server',
				additionalProperties: false,
				properties: {
					'0': {
						type: 'integer',
						minimum: 1,
						maximum: 65534,
						title: 'Short Server ID',
						description: 'Used as link to associate server Object Instance.',
					},
					'1': {
						type: 'integer',
						title: 'Lifetime',
						description:
							'Specify the lifetime of the registration in seconds (see Client Registration Interface). If the value is set to 0, the lifetime is infinite. Units: s.',
					},
				},
				required: ['0', '1'],
			},
		}
		const object = {
			'0': {
				'0': {
					value: 1,
				},
				'1': {},
			},
			'1': {
				'0': {
					value: 1,
				},
				'1': {
					value: 50,
				},
			},
		}
		const result = [
			undefined,
			{
				'0': 1,
				'1': 50,
			},
		]

		assert.deepEqual(convertToLwM2MArrayInstance(object, schema), result)
	})
})
