export type LwM2MCoiote = Record<string, Instance>
export type Instance = Record<string, Resource>
export type Resource = Record<string, Value | List | EmptyValue>
export type EmptyValue = Record<string, never>
type ListLength = {
	// Describes the number of entries in the list
	dim: string
}
export type List = {
	[key: string]: Value | ListLength
} & {
	attributes: ListLength
}
export type Value = { value: string | number | boolean }

export const isList = (v: unknown): v is List =>
	v !== null &&
	typeof v === 'object' &&
	'attributes' in v &&
	v.attributes !== null &&
	typeof v.attributes === 'object' &&
	'dim' in v.attributes

export const isValue = (v: unknown): v is Value =>
	v !== null && typeof v === 'object' && 'value' in v

export const isSingleInstance = (v: unknown): v is { '0': Resource } =>
	v !== null && typeof v === 'object' && '0' in v
