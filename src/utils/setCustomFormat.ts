import customObjectsSchema from '../../schemas/Config_50009.json'
import type { lwm2mCoiote } from '../converter'
import { convertObjectUsingSchema } from './convertObjectUsingSchema.js'
import { removeFormat } from './removeFormat.js'

export type customObjectValue = Record<string, number | string | boolean>
export type customObject = Record<string, customObjectValue>

/**
 * Remove coiote format from custom object and set format taking custom object schema if it exist
 */
export const setCustomFormat = (object: lwm2mCoiote): customObject => {
	const urn = Object.keys(object)[0] as string
	const instances = Object.values(object)[0]

	if (urn === undefined || instances === undefined) {
		console.warn('missing values ', { urn, instances })
		return {}
	}

	const schema =
		customObjectsSchema.properties[
			urn as unknown as keyof (typeof customObjectsSchema)['properties']
		]

	if (schema === undefined) {
		return {
			[`${urn}`]: removeFormat(instances),
		} as customObject
	}

	return {
		[urn]: convertObjectUsingSchema(instances, schema),
	} as customObject
}
