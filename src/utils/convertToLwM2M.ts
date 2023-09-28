import type { Instance, LwM2MAssetTrackerV2 } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { Config_50009_urn } from 'src/schemas/Config_50009.js'
import { setLwM2MFormat } from './setLwM2MFormat.js'
import { setCustomFormat } from './setCustomFormat.js'
import { LwM2MFormatError, checkLwM2MFormat } from './checkLwM2MFormat.js'

/**
 * check if undefine ---> return warning
 * remove coiote format
 * check LwM2M format --> return error
 * return result  ---> return result
 */
export const convertToLwM2M = ({
	LwM2MObjectUrn,
	coioteObject,
}: {
	LwM2MObjectUrn: keyof LwM2MAssetTrackerV2
	coioteObject: Instance | undefined
}):
	| {
			result: unknown // TODO: fix type valueOf LwM2MAssetTrackerV2
	  }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError } => {
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

	const validatedLwM2MFormat = checkLwM2MFormat(coioteFormatRemoved)

	if ('error' in validatedLwM2MFormat)
		return { error: validatedLwM2MFormat.error }

	return { result: coioteFormatRemoved[LwM2MObjectUrn] } // TODO: fix type
}
