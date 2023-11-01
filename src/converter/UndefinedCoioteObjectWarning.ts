import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { LwM2MAssetTrackerV2 } from '../converter.js'

/**
 * Warning handler type
 */
export class UndefinedCoioteObjectWarning extends Error {
	constructor(LwM2MObjectUrn: keyof LwM2MAssetTrackerV2) {
		const LwM2MObjectInfo = parseURN(LwM2MObjectUrn)
		super(
			`'${LwM2MObjectUrn}' object can not be converted because object id '${LwM2MObjectInfo.ObjectID}' is undefined in input received`,
		)
	}
}

/**
 * Return a warning
 */
export const warning = (
	objectUrn: keyof LwM2MAssetTrackerV2,
): { error: UndefinedCoioteObjectWarning } => {
	return { error: new UndefinedCoioteObjectWarning(objectUrn) }
}
