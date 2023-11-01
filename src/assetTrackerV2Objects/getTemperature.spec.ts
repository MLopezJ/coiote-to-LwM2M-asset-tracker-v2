import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getTemperature } from './getTemperature.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import type { Instance } from '../coiote/LwM2MCoioteType.js'
import { ValidationError } from '../converter/ValidationError.js'
import {
	Temperature_3303_urn,
	type Temperature_3303,
} from '../schemas/lwm2m.js'
import {
	parseTime,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'

void describe('getTemperature', () => {
	void it(`should create the LwM2M object 'Temperature' (3303) from the object '3303' reported by Coiote`, () => {
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3303': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						$lastUpdated: '2023-08-18T14:39:11.9414162Z',
					},
					$lastUpdated: '2023-08-18T14:39:11.9414162Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}
		const temperature_coiote = {
			'0': {
				'5601': {
					value: 27.18,
				},
				'5602': {
					value: 27.71,
				},
				'5700': {
					value: 27.18,
				},
				'5701': {
					value: 'Cel',
				},
				'5518': {
					value: 1675874731,
				},
			},
		}
		const expected = [
			{
				'5601': 27.18,
				'5602': 27.71,
				'5700': 27.18,
				'5701': 'Cel',
				'5518': 1675874731,
			},
		]

		const temperature = getTemperature(metadata, temperature_coiote) as {
			result: unknown
		}
		assert.deepEqual(temperature.result, expected)
	})

	void it(`should return a warning if the object '3303' reported by Coiote is not defined`, () => {
		const temperature_coiote = undefined
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3303': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						$lastUpdated: '2023-08-18T14:39:11.9414162Z',
					},
					$lastUpdated: '2023-08-18T14:39:11.9414162Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const temperature = getTemperature(metadata, temperature_coiote) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.deepEqual(
			temperature.error.message,
			`'${Temperature_3303_urn}' object can not be converted because object id '3303' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the LwM2M schema definition`, () => {
		const temperature_coiote = {
			'0': {
				'5601': {
					value: 27.18,
				},

				'5602': {
					value: 27.71,
				},
				/*
			'5700': {
				value: 27.18, // required value is missing
			},
			*/
				'5701': {
					value: 'Cel',
				},
			},
		}
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3303': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						$lastUpdated: '2023-08-18T14:39:11.9414162Z',
					},
					$lastUpdated: '2023-08-18T14:39:11.9414162Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const temperature = getTemperature(
			metadata,
			temperature_coiote as unknown as Instance,
		) as {
			error: ValidationError
		}
		const errorMessage = temperature.error.description[0]?.message
		const keyword = temperature.error.description[0]?.keyword
		assert.equal(errorMessage, `must have required property '5700'`)
		assert.equal(keyword, 'required')
	})

	void it(`should use metadata object to report timestamp when it is not present in object`, () => {
		const temperature_coiote = {
			'0': {
				'5601': {
					value: 27.18,
				},
				'5602': {
					value: 27.71,
				},
				'5700': {
					value: 27.18,
				},
				'5701': {
					value: 'Cel',
				},
				// 5518, resource to report timestamp, is not defined in input object
			},
		}
		const timeToReport = '2023-10-18T14:39:11.9414162Z'
		const timeToReportParsed = parseTime(timeToReport)
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3303': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: timeToReport,
							},
						},
						'5701': {
							$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							value: {
								$lastUpdated: '2023-08-18T14:39:11.9414162Z',
							},
						},
						$lastUpdated: '2023-08-18T14:39:11.9414162Z',
					},
					$lastUpdated: '2023-08-18T14:39:11.9414162Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const temperature = getTemperature(metadata, temperature_coiote) as {
			result: Temperature_3303
		}
		assert.deepEqual(temperature.result[0]?.[5518], timeToReportParsed)
	})
})
