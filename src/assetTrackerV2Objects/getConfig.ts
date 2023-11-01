import { warning } from '../converter/UndefinedCoioteObjectWarning.js'
import type { ConversionResult } from '../converter/ConversionResult.js'
import type { Instance as CoioteFormat } from '../coiote/LwM2MCoioteType.js'
import {
	Config_50009_urn,
	type Config_50009,
	Config_50009_Typebox,
} from '../schemas/Config_50009.js'
import { unwrapSingleInstance as removeCoioteFormatFrom } from '../coiote/unwrapSingleInstance.js'
import { validateAgainstSchema } from './validateAgainstSchema.js'

/**
 * Convert to LwM2M Config object (id 50009) from the object 50009 reported by Coiote
 */
export const getConfig = (
	object?: CoioteFormat,
): ConversionResult<Config_50009> => {
	if (object === undefined) return warning(Config_50009_urn)

	const maybeConfig = removeCoioteFormatFrom<Config_50009>(object)

	return validateAgainstSchema(maybeConfig, Config_50009_Typebox)
}
