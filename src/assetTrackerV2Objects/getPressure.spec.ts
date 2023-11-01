import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getPressure } from './getPressure.js'
import type { UndefinedCoioteObjectWarning } from '../converter/UndefinedCoioteObjectWarning.js'
import type { Instance } from '../coiote/LwM2MCoioteType.js'
import { ValidationError } from '../converter/ValidationError.js'
import { Pressure_3323_urn, type Pressure_3323 } from '../schemas/lwm2m.js'
import {
	parseTime,
	type Metadata,
} from '../converter/getTimestampFromMetadata.js'

void describe('getPressure', () => {
	void it(`should create the LwM2M object 'Pressure' (3323) from the object '3323' reported by Coiote`, () => {
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3323': {
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
		const pressure_coiote = {
			'0': {
				'5601': {
					value: 101697,
				},
				'5602': {
					value: 101705,
				},
				'5700': {
					value: 10,
				},
				'5701': {
					value: 'Pa',
				},
				'5518': {
					value: 1675874731,
				},
			},
		}
		const expected = [
			{
				'5601': 101697,
				'5602': 101705,
				'5700': 10,
				'5701': 'Pa',
				'5518': 1675874731,
			},
		]

		const pressure = getPressure(metadata, pressure_coiote) as {
			result: unknown
		}
		assert.deepEqual(pressure.result, expected)
	})

	void it(`should return a warning if the object '3323' reported by Coiote is not defined`, () => {
		const pressure_coiote = undefined
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3323': {
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

		const pressure = getPressure(metadata, pressure_coiote) as {
			error: UndefinedCoioteObjectWarning
		}
		assert.deepEqual(
			pressure.error.message,
			`'${Pressure_3323_urn}' object can not be converted because object id '3323' is undefined in input received`,
		)
	})

	void it(`should return an error if the result of the conversion does not meet the LwM2M schema definition`, () => {
		const pressure_coiote = {
			'0': {
				'5601': {
					value: 101697,
				},
				'5602': {
					value: 101705,
				},
				/*
                // required value is missing
				'5700': {
					value: 10,
				},
                */
				'5701': {
					value: 'Pa',
				},
			},
		}
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3323': {
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

		const temperature = getPressure(
			metadata,
			pressure_coiote as unknown as Instance,
		) as {
			error: ValidationError
		}

		const errorMessage = temperature.error.description[0]?.message
		const keyword = temperature.error.description[0]?.keyword
		assert.equal(errorMessage, `must have required property '5700'`)
		assert.equal(keyword, 'required')
	})

	void it(`should use metadata object to report timestamp when it is not present in object`, () => {
		const pressure_coiote = {
			'0': {
				'5601': {
					value: 101697,
				},
				'5602': {
					value: 101705,
				},
				'5700': {
					value: 10,
				},
				'5701': {
					value: 'Pa',
				},
				// 5518, resource to report timestamp, is not defined in input object
			},
		}
		const timeToReport = '2023-10-18T14:39:11.9414162Z'
		const timeToReportParsed = parseTime(timeToReport)
		const metadata: Metadata = {
			$lastUpdated: '2023-08-18T14:39:11.9414162Z',
			lwm2m: {
				'3323': {
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

		const pressure = getPressure(metadata, pressure_coiote) as {
			result: Pressure_3323
		}
		assert.deepEqual(pressure.result[0]?.[5518], timeToReportParsed)
	})
})
