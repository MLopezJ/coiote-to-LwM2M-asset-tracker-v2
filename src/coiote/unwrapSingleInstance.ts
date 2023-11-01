import type {
	List,
	Value,
	Instance as coioteInstance,
} from './LwM2MCoioteType.js'

/**
 * Single Instances objects in Assset Tracker v2
 */
type SingleInstancesObj = Record<string, unknown>

/**
 *  Remove coiote format from single instance object
 */
export const unwrapSingleInstance = (
	input: coioteInstance,
): SingleInstancesObj => {
	const resources = input['0'] ?? []
	const instance = Object.entries(resources)
		.map(([resourceId, value]) => {
			const newFormat = removeKeyFromResource(value)
			return {
				[`${resourceId}`]: newFormat,
			}
		})
		.reduce(
			(previous: Record<string, unknown>, current) => ({
				...current,
				...previous,
			}),
			{},
		)
	return instance
}

/**
 * Remove the key 'value' from input
 */
export const removeKeyFromResource = (resource: Value | List): unknown => {
	if ((resource as List).attributes !== undefined) {
		return Object.values(resource)
			.filter((element) => {
				if (element.dim === undefined) {
					return element
				}
			})
			.map((element) => element.value)
	}

	return resource.value
}
