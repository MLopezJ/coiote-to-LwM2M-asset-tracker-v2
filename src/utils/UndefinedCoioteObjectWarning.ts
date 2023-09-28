import { parseURN } from '@nordicsemiconductor/lwm2m-types'
import type { LwM2MAssetTrackerV2 } from 'src/converter.js'

/**
 * Warning handler type
 * TODO: add ADR link
 */
export class UndefinedCoioteObjectWarning extends Error {
	constructor(LwM2MObjectUrn: keyof LwM2MAssetTrackerV2) {
		const LwM2MObjectInfo = parseURN(LwM2MObjectUrn)
		super(
			`'${LwM2MObjectUrn}' object can not be converter because object id '${LwM2MObjectInfo.ObjectID}' is undefined in input received`,
		)
	}
}
