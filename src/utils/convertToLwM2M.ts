import type { Instance, LwM2MAssetTrackerV2 } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { Config_50009_urn } from 'src/schemas/Config_50009.js'
import { setLwM2MFormat } from './setLwM2MFormat.js'
import { setCustomFormat } from './setCustomFormat.js'
import { LwM2MFormatError, checkLwM2MFormat } from './checkLwM2MFormat.js'

type ValueOf<T> = T[keyof T]

/**
 * Defines the result type of 'convertToLwM2M' method, which will be one of the following options
 * - result: contains the object converter from coiote format to LwM2M format
 * - error: contains an object indicating the object has not the LwM2M format.
 * - warning: contains an object indicating that the coiote object is undefined.
 */
type convertToLwM2MType =
	| { result: ValueOf<LwM2MAssetTrackerV2> }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

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
}): convertToLwM2MType => {
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
