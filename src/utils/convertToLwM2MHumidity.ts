import { type Humidity_3304, Humidity_3304_urn } from '../schemas/index.js'
import type { Instance } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { LwM2MFormatError, checkLwM2MFormat } from './checkLwM2MFormat.js'
import {
	getTimestampFromMetadata,
	type Metadata,
} from './getTimestampFromMetadata.js'
import { isTimestampUndefinedIn } from './isTimestampUndefinedIn.js'
import { getLwM2MSchemaDefinition } from './getLwM2MSchemaDefinition.js'
import { convertToLwM2MArrayInstance } from './convertToLwM2MArrayInstance.js'

type convertToLwM2MHumidityResult =
	| { result: Humidity_3304 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Build the Humidity object from LwM2M using the object 3304 reported by Coiote
 */
export const convertToLwM2MHumidity = (
	metadata: Metadata,
	objectWithCoioteFormat?: Instance,
): convertToLwM2MHumidityResult => {
	if (objectWithCoioteFormat === undefined)
		return { warning: new UndefinedCoioteObjectWarning(Humidity_3304_urn) }

	const schema = getLwM2MSchemaDefinition(Humidity_3304_urn)
	const humidity = convertToLwM2MArrayInstance(
		objectWithCoioteFormat,
		schema,
	) as unknown as Humidity_3304 // TODO: return the type in the function

	if (humidity[0] !== undefined && isTimestampUndefinedIn(humidity) === true) {
		humidity[0][5518] = getTimestampFromMetadata(Humidity_3304_urn, metadata)
	}

	const validatedLwM2MHumidity = checkLwM2MFormat({
		[Humidity_3304_urn]: humidity,
	})

	if ('error' in validatedLwM2MHumidity) {
		return { error: validatedLwM2MHumidity.error }
	}

	return {
		result: humidity,
	}
}
