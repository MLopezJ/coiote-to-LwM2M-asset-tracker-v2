/**
 * check if undefine ---> return warning
 * remove coiote format
 * check LwM2M format --> return error
 * return result  ---> return result
 */
export const convertToLwM2M = (
	object: unknown,
):
	| {
			result: unknown
	  }
	| { warning: unknown }
	| { error: unknown } => {
	return { warning: 'something' }
}
