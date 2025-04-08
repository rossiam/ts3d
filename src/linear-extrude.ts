import { combinator } from './combinator.ts'
import type { Shape } from './shape.ts'


export type LinearExtrudeOptions = {
	height: number
	v?: [number, number, number]
	center?: boolean
	convexity?: number
	twist?: number
	slices?: number
	scale?: number | [number, number, number]
}
export const linearExtrude = (
	options: LinearExtrudeOptions,
	...shapes: (Shape | undefined | null)[]
): Shape => {
	let args = `height = ${options.height}`
	if (options.v) {
		args += `, v = [${options.v[0]}, ${options.v[1]}, ${options.v[2]}]`
	}
	if (options.center) {
		args += `, center = ${options.center}`
	}
	if (options.convexity) {
		args += `, convexity = ${options.convexity}`
	}
	if (options.twist) {
		args += `, twist = ${options.twist}`
	}
	if (options.slices) {
		args += `, slices = ${options.slices}`
	}
	if (options.scale) {
		const scaleValue = typeof options.scale === 'number'
			? options.scale
			: `[${options.scale[0]}, ${options.scale[1]}, ${options.scale[2]}]`
		args += `, scale = ${scaleValue}`
	}
	return combinator('linear_extrude', args, ...shapes)
}
