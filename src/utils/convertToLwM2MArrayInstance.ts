import type { LwM2MDocumentSchema } from '@nordicsemiconductor/lwm2m-types'
import type { Instance } from '../converter'
import { convertResourceUsingSchema } from './convertResourceUsingSchema.js'

type LwM2MArrayInstance = (Record<string, unknown> | undefined)[]

/**
 * Remove coiote format from instances of a LwM2M object and convert to list using the given schema
 */
export const convertToLwM2MArrayInstance = (
	input: Instance,
	schema: (typeof LwM2MDocumentSchema.properties)[keyof (typeof LwM2MDocumentSchema)['properties']],
): LwM2MArrayInstance => {
	const instances = Object.entries(input)
	const requiredResources: string[] = schema.items.required // required resources in the LwM2M schema definition of that object
	return instances.map(([instanceId, resources]) => {
		const instance = Object.entries(resources)
			.map(([resourceId, value]) => {
				const isRequired = requiredResources.includes(resourceId)
				const dataType = schema.items.properties[`${resourceId}`].type
				const resource = convertResourceUsingSchema(
					value,
					resourceId,
					isRequired,
					dataType,
				)

				/**
				 * if resource value is false, means that it is required by schema definition but is not present in the given params.
				 * this case will be represent in the final result as undefined value, but in the mean time it is represent as false value
				 */
				if (resource === false) {
					console.warn(
						`id ${resourceId} is required in object in order with schema definition but missing in instance ${instanceId}`,
						schema,
					)
				}

				return resource
			})
			.filter((result) => result !== undefined) // remove empty values
			.reduce(
				(previous, current) =>
					current === false ? undefined : { ...current, ...previous },
				// false means a required resource is not present in the given params, for that reason is changed to undefined
				{},
			)
		return instance
	}) as LwM2MArrayInstance
}
