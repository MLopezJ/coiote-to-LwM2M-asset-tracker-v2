import type { LwM2MDocument } from '@nordicsemiconductor/lwm2m-types'
import { LwM2MDocumentSchema } from '@nordicsemiconductor/lwm2m-types'
import type { Instance, LwM2MAssetTrackerV2 } from '../converter'
import { convertToLwM2MArrayInstance } from './convertToLwM2MArrayInstance.js'
import { convertToLwM2MInstance } from './convertToLwM2MInstance.js'

/**
 * Object which id is an URN from '@nordicsemiconductor/lwm2m-types' lib
 */
export type ObjectWithUrn = {
	[key in keyof LwM2MDocument]: Instance
}

/**
 * TODO:
 *
 * Is not needed to set the LwM2M format to all the LwM2M object, only for the objects that are in Asset Tracker v2. Thats why the return type
 * of setLwM2MFormat was updated.
 *
 * Also, that method should be renamed. setLwM2MOmaRegistry its a better name.
 */

/**
 * Set LwM2M format using @nordicsemiconductor/lwm2m-types json schema
 */
export const setLwM2MFormat = (object: ObjectWithUrn): LwM2MAssetTrackerV2 => {
	const urn = Object.keys(object)[0]
	const instances = Object.values(object)[0]

	if (urn === undefined || instances === undefined) {
		console.error('missing values ', { urn, instances })
		return {}
	}

	const schema =
		LwM2MDocumentSchema.properties[
			urn as unknown as keyof (typeof LwM2MDocumentSchema)['properties']
		]

	if (schema.type === 'array') {
		return {
			[urn]: convertToLwM2MArrayInstance(instances, schema),
		}
	}

	const instance = instances // instances should be instance, because it is an object in this case
	return {
		[urn]: convertToLwM2MInstance(instance, schema),
	}
}
