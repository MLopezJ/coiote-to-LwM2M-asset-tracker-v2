import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getHumidity } from './getHumidity.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import { ValidationError } from '../converter/ValidationError.js'
import { Humidity_3304_urn, type Humidity_3304 } from '../schemas/lwm2m.js'
import {
	parseTime,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'

void describe('getHumidity', () => {
	void it(`should create the LwM2M object 'Humidity' (3304) from the object '3304' reported by Coiote`, () => {
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3304': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						$lastUpdated: '2023-08-13T18:52:20.8691663Z',
					},
					$lastUpdated: '2023-08-13T18:52:20.8691663Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}
		const humidity_coiote = {
			'0': {
				'5601': {
					value: 23.535,
				},
				'5602': {
					value: 24.161,
				},
				'5700': {
					value: 24.057,
				},
				'5701': {
					value: '%RH',
				},
				'5518': {
					value: 1675874731,
				},
			},
		}
		const expected = [
			{
				'5601': 23.535,
				'5602': 24.161,
				'5700': 24.057,
				'5701': '%RH',
				'5518': 1675874731,
			},
		]

		const humidity = getHumidity(metadata, humidity_coiote) as {
			result: unknown
		}
		assert.deepEqual(humidity.result, expected)
	})

	void it(`should return a warning if the object '3304' reported by Coiote is not defined`, () => {
		const humidity_coiote = undefined
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3304': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						$lastUpdated: '2023-08-13T18:52:20.8691663Z',
					},
					$lastUpdated: '2023-08-13T18:52:20.8691663Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const humidity = getHumidity(metadata, humidity_coiote) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.deepEqual(
			humidity.error.message,
			`'${Humidity_3304_urn}' object can not be converted because object id '3304' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the LwM2M schema definition`, () => {
		const humidity_coiote = {
			'0': {
				'5601': {
					value: 23.535,
				},
				'5602': {
					value: 24.161,
				},
				/*
                // required value is missing
				'5700': {
					value: 24.057,
				},
                */
				'5701': {
					value: '%RH',
				},
				'5518': {
					value: 1675874731,
				},
			},
		}
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3304': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						'5701': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						$lastUpdated: '2023-08-13T18:52:20.8691663Z',
					},
					$lastUpdated: '2023-08-13T18:52:20.8691663Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const humidity = getHumidity(metadata, humidity_coiote as any) as {
			error: ValidationError
		}
		const errorMessage = humidity.error.description[0]?.message
		const keyword = humidity.error.description[0]?.keyword
		assert.equal(errorMessage, `must have required property '5700'`)
		assert.equal(keyword, 'required')
	})

	void it(`should use metadata object to report timestamp when it is not present in object`, () => {
		const humidity_coiote = {
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
				'3304': {
					'0': {
						'5700': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: timeToReport,
							},
						},
						'5701': {
							$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							value: {
								$lastUpdated: '2023-08-13T18:52:20.8691663Z',
							},
						},
						$lastUpdated: '2023-08-13T18:52:20.8691663Z',
					},
					$lastUpdated: '2023-08-13T18:52:20.8691663Z',
				},
				$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			},
		}

		const humidity = getHumidity(metadata, humidity_coiote) as {
			result: Humidity_3304
		}
		assert.deepEqual(humidity.result[0]?.[5518], timeToReportParsed)
	})
})
