import { assetTrackerObjectsList } from '../getAssetTrackerV2Objects.js'
/**
 * Check if the expected LwM2M objects in Asset Tracker web app are into the input
 */
export const checkAssetTrackerV2Objects = (
	list: string[],
): { result: true } | { warning: Error } => {
	const missingObjects = assetTrackerObjectsList.reduce(
		(previous: string[], current: string) => {
			if (list.includes(current) === false) return [...previous, current]
			return previous
		},
		[],
	)

	if (missingObjects.length > 0)
		return {
			warning: new Error(
				`the following LwM2M objects are expected to be part of the output but missing in input. \nMissing objects: ${JSON.stringify(
					missingObjects,
				)}.`,
			),
			// TODO: create error message
			// https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
		}

	return { result: true }
}
