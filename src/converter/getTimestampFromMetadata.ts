import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import {
	type Humidity_3304_urn,
	type Pressure_3323_urn,
	type Temperature_3303_urn,
} from '../schemas/lwm2m.js'

export type Metadata = {
	$lastUpdated: string
	lwm2m: LwM2M_Metadata
}

export type LwM2M_Metadata = {
	[key: `${number}`]: Obj // object ID : object
	$lastUpdated: string
}

export type Obj = {
	[key: `${number}`]: Instance // Instance id : instance
	$lastUpdated: string
}

export type Instance = {
	[key: `${number}`]: Resource // Resource id : resource
	$lastUpdated: string
}

type Resource = {
	$lastUpdated: string
	value: {
		$lastUpdated: string
	}
}

/**
 * Convert string date to seconds
 */
export const parseTime = (time: string): number =>
	Math.trunc(new Date(time).getTime() / 1000)

/**
 * Find timestamp value for given object following timestamp hierarchy
 *
 * Default instance to be used is 0
 * Default resource to be used is 5700
 * Value returned is in seconds
 *
 * @see {@link ../../adr/004-timestamp-hierarchy.md}
 */
export const getTimestampFromMetadata = (
	objectUrn:
		| typeof Temperature_3303_urn
		| typeof Humidity_3304_urn
		| typeof Pressure_3323_urn,
	metadata: Metadata,
): number => {
	const { ObjectID } = parseURN(objectUrn)
	const object = metadata.lwm2m[`${parseInt(ObjectID, 10)}`]

	if (object !== undefined) {
		if (object['0'] !== undefined) {
			const resource = object['0']['5700']?.value.$lastUpdated
			if (resource !== undefined) return parseTime(resource)

			const instance = object['0']?.$lastUpdated
			if (instance !== undefined) return parseTime(instance)
		}

		// timestamp reported from object
		const obj = object?.$lastUpdated
		if (obj !== undefined) return parseTime(obj)
	}

	const lwm2m = metadata.lwm2m.$lastUpdated
	if (lwm2m !== undefined) return parseTime(lwm2m)

	return 0
}
