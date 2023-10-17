import {
	Temperature_3303_urn,
	type Temperature_3303,
} from '../schemas/index.js'
import type { Instance } from 'src/converter.js'
import { UndefinedCoioteObjectWarning } from './UndefinedCoioteObjectWarning.js'
import { LwM2MFormatError, validateLwM2MFormat } from './checkLwM2MFormat.js'
import {
	getTimestampFromMetadata,
	type Metadata,
} from './getTimestampFromMetadata.js'
import { isTimestampUndefinedIn } from './isTimestampUndefinedIn.js'
import { getLwM2MSchemaDefinition } from './getLwM2MSchemaDefinition.js'
import { convertToLwM2MArrayInstance } from './convertToLwM2MArrayInstance.js'

type getTemperatureResult =
	| { result: Temperature_3303 }
	| { warning: UndefinedCoioteObjectWarning }
	| { error: LwM2MFormatError }

/**
 * Build the Temperature object from LwM2M using the object 3303 reported by Coiote
 */
export const getTemperature = (
	metadata: Metadata,
	objectWithCoioteFormat?: Instance,
): getTemperatureResult => {
	if (objectWithCoioteFormat === undefined)
		return { warning: new UndefinedCoioteObjectWarning(Temperature_3303_urn) }

	const schema = getLwM2MSchemaDefinition(Temperature_3303_urn)
	const temperature = convertToLwM2MArrayInstance(
		objectWithCoioteFormat,
		schema,
	) as unknown as Temperature_3303 // TODO: return the type in the function

	if (
		temperature[0] !== undefined &&
		isTimestampUndefinedIn(temperature) === true
	)
		temperature[0][5518] = getTimestampFromMetadata(
			Temperature_3303_urn,
			metadata,
		)

	return validateLwM2MFormat(Temperature_3303_urn, temperature)
}
