import { assetTrackerObjectsList } from '../getAssetTrackerV2Objects.js'

export class Warning extends Error {
	override name: string
	override message: string
	missingObjects: string[]

	constructor({
		name,
		message,
		missingObjects,
	}: {
		name: string
		message: string
		missingObjects: string[]
	}) {
		super()

		this.name = name
		this.message = message
		this.missingObjects = missingObjects
	}
}

/**
 * Check if the expected LwM2M objects in Asset Tracker v2 are into the input
 */
export const checkAssetTrackerV2Objects = (
	list: string[],
): { result: true } | { warning: Warning } => {
	const missingObjects = assetTrackerObjectsList.reduce(
		(previous: string[], current: string) => {
			if (list.includes(current) === false) return [...previous, current]
			return previous
		},
		[],
	)

	if (missingObjects.length > 0)
		return {
			warning: new Warning({
				name: 'warning',
				message: 'Missing expected objects',
				missingObjects,
			}),
		}

	return { result: true }
}
