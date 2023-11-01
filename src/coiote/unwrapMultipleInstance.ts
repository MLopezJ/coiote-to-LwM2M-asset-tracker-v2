import type { Instance } from './LwM2MCoioteType.js'
import { removeKeyFromResource } from './unwrapSingleInstance.js'

/**
 * Remove coiote format from multiple instance object
 */
export const unwrapMultipleInstance = <MultipleInstancesObj>(
	input: Instance,
): MultipleInstancesObj => {
	const instances = Object.entries(input).map(([, resources]) => {
		const instance = Object.entries(resources)
			.map(([resourceId, value]) => {
				const newFormat = removeKeyFromResource(value)
				return {
					[`${resourceId}`]: newFormat,
				}
			})
			.reduce((previous, current) => ({ ...current, ...previous }), {})
		return instance
	})
	return instances as MultipleInstancesObj
}
