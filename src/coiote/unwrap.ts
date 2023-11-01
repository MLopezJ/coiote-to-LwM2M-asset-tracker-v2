import {
	type Value,
	type List,
	isList,
	isValue,
	type EmptyValue,
	type Resource,
	type Instance,
} from './LwM2MCoioteType.js'

const unwrapValue = (v: Value | List | EmptyValue) => {
	// it has a value property
	if (typeof v === 'object' && 'value' in v) return v.value
	// It is a list
	if (isList(v)) {
		return (
			Object.values(v)
				// Take only the number of keys specified in the list attributes
				.slice(0, parseInt(v.attributes.dim, 10))
				.map((v) => (isValue(v) ? v.value : undefined))
		)
	}
	return undefined
}

const unwrapResource = (resource: Resource): UnwrappedResource =>
	Object.entries(resource).reduce(
		(result, [k, v]) => ({ ...result, [k]: unwrapValue(v) }),
		{},
	)

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

/**
 * Remove Coiote format from single instance object
 */
export const unwrapSingleInstance = <Unwrapped extends Readonly<unknown>>({
	0: resource,
}: {
	0: Resource
}): Writeable<Unwrapped> => unwrapResource(resource) as Writeable<Unwrapped>

type UnwrappedResource = Record<
	string,
	number | string | Array<number | string | undefined> | undefined
>

/**
 * Remove Coiote format from multiple instance object
 */
export const unwrapMultipleInstance = <
	Unwrapped extends Readonly<Array<unknown>>,
>(
	input: Instance,
): Unwrapped =>
	Object.values(input).map((instance) =>
		unwrapResource(instance),
	) as Writeable<Unwrapped>
