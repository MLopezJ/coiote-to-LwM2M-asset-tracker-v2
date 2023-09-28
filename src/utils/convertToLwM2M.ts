import type { LwM2MAssetTrackerV2 } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'

/**
 * check if undefine ---> return warning
 * remove coiote format
 * check LwM2M format --> return error
 * return result  ---> return result
 */
export const convertToLwM2M = (
	coioteObject: unknown,
	LwM2MObjectUrn: keyof LwM2MAssetTrackerV2,
):
	| {
			result: unknown
	  }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: unknown } => {
	if (coioteObject === undefined) {
		return { warning: new UndefinedCoioteObjectWarning(LwM2MObjectUrn) }
	}
	return { error: 'something' }
}
