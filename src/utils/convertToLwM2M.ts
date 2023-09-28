import type { LwM2MAssetTrackerV2 } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { Config_50009_urn } from 'src/schemas/Config_50009.js'
import { setLwM2MFormat } from './setLwM2MFormat.js'
import { setCustomFormat } from './setCustomFormat.js'
import { checkLwM2MFormat } from './checkLwM2MFormat.js'

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
			result: unknown // TODO: fix type
	  }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: unknown } => {
	if (coioteObject === undefined) {
		return { warning: new UndefinedCoioteObjectWarning(LwM2MObjectUrn) }
	}

	let coioteFormatRemoved = undefined
	if (LwM2MObjectUrn === Config_50009_urn) {
		coioteFormatRemoved = setCustomFormat({
			[`${LwM2MObjectUrn}`]: coioteObject,
		}) // TODO: fix type
	} else {
		coioteFormatRemoved = setLwM2MFormat({
			[`${LwM2MObjectUrn}`]: coioteObject,
		})
	}

	const validatedLwM2MFormat = checkLwM2MFormat({ coioteFormatRemoved } as any)

	if ('error' in validatedLwM2MFormat)
		return { error: validatedLwM2MFormat.error }

	return { result: coioteFormatRemoved[LwM2MObjectUrn] } // TODO: fix type
}
