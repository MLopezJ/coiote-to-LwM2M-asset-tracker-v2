import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { checkLwM2MFormat, type LwM2MFormatError } from './checkLwM2MFormat.js'
import type { Instance } from 'src/converter.js'
import {
	Config_50009_urn,
	type Config_50009,
} from 'src/schemas/Config_50009.js'
import { setCustomFormat } from './setCustomFormat.js'

export type convertToLwM2MConfigResult =
	| { result: Config_50009 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Convert to LwM2M Config object (id 50009) from the object 50009 reported by Coiote
 */
export const convertToLwM2MConfig = (
	config_coiote?: Instance,
): convertToLwM2MConfigResult => {
	if (config_coiote === undefined)
		return { warning: new UndefinedCoioteObjectWarning(Config_50009_urn) }

	const config = setCustomFormat({
		[`${Config_50009_urn}`]: config_coiote,
	})

	// FIXME: this check is not working.
	const validatedLwM2MConfig = checkLwM2MFormat(config)

	if ('error' in validatedLwM2MConfig)
		return { error: validatedLwM2MConfig.error }

	return { result: config[Config_50009_urn] as unknown as Config_50009 }
}
