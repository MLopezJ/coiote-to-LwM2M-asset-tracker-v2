import type { Instance } from './LwM2MCoioteType.js'
import { removeKeyFromResource } from './unwrapSingleInstance.js'

/**
 * Multiple Instances objects in Assset Tracker v2
 */
type MultipleInstancesObj = Record<string, unknown>[]

/**
 * Remove coiote format from multiple instance object
 */
export const unwrapMultipleInstance = (
	input: Instance,
): MultipleInstancesObj => {
	const instances = Object.entries(input)
	return instances.map(([, resources]) => {
		const instance = Object.entries(resources)
			.map(([resourceId, value]) => {
				const newFormat = removeKeyFromResource(value)
				return {
					[`${resourceId}`]: newFormat,
				}
			})
			.reduce((previous, current) => ({ ...current, ...previous }), {})
		return instance
	}) as unknown as MultipleInstancesObj
}
