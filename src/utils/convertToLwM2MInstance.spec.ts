import { describe, it } from 'node:test'
import assert from 'node:assert'
import { convertToLwM2MInstance } from './convertToLwM2MInstance.js'

void describe('convertToLwM2MInstance', () => {
	void it('should convert object using object type definition schema', () => {
		const schema = {
			type: 'object',
			$id: 'https://github.com/OpenMobileAlliance/lwm2m-registry/raw/prod/3.xml',
			title: 'Device',
			description:
				'This LwM2M Object provides a range of device related information which can be queried by the LwM2M Server, and a device reboot and factory reset function. LWM2MVersion: 1.1 ObjectVersion: 1.2 MultipleInstances: false Mandatory: true',
			additionalProperties: false,
			properties: {
				'0': {
					type: 'string',
					title: 'Manufacturer',
					description: 'Human readable manufacturer name',
				},
				'1': {
					type: 'string',
					title: 'Model Number',
					description: 'A model identifier (manufacturer specified string)',
				},
				'11': {
					type: 'array',
					minItems: 1,
					items: { type: 'integer', minimum: 0, maximum: 32 },
					title: 'Error Code',
					description:
						'0=No error\r\n1=Low battery power\r\n2=External power supply off\r\n3=GPS module failure\r\n4=Low received signal strength\r\n5=Out of memory\r\n6=SMS failure\r\n7=IP connectivity failure\r\n8=Peripheral malfunction\r\n9..15=Reserved for future use\r\n16..32=Device specific error codes\r\n\r\nWhen the single Device Object Instance is initiated, there is only one error code Resource Instance whose value is equal to 0 that means no error. When the first error happens, the LwM2M Client changes error code Resource Instance to any non-zero value to indicate the error type. When any other error happens, a new error code Resource Instance is created. When an error associated with a Resource Instance is no longer present, that Resource Instance is deleted. When the single existing error is no longer present, the LwM2M Client returns to the original no error state where Instance 0 has value 0.\r\nThis error code Resource MAY be observed by the LwM2M Server. How to deal with LwM2M Client’s error report depends on the policy of the LwM2M Server. Error codes in between 16 and 32 are specific to the Device and may have different meanings among implementations.',
				},
				'16': {
					type: 'string',
					title: 'Supported Binding and Modes',
					description:
						'Indicates which bindings and modes are supported in the LwM2M Client. The possible values are those listed in the LwM2M Core Specification.',
				},
			},
			required: ['11', '16'],
		}
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
					attributes: {
						dim: '1',
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
			'11': [0],
			'16': 'UQ',
		}

		assert.deepEqual(convertToLwM2MInstance(object, schema), result)
	})
})
