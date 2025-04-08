

export const defaultIndentStr = '\t'

// TODO: handle $fa, $fs, and $fn args; maybe other $args too
// TODO: add "debug" along with $fn, $fs, and $fa to every function as an option

export type Value =
	| number
	| string
	| boolean
	| undefined
	| Value[]

export type Variable = {
	name: string
	value: Value
}

export const renderValue = (value: Value): string => {
	if (typeof value === 'string') {
		// TODO: ensure correct escaping
		return `"${value}"`
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return value.toString()
	}
	if (value === undefined) {
		return 'undef'
	}

	return '[' + value.map(item => renderValue(item)).join(',') + ']'
}
