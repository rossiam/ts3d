import { hull } from './container.ts'
import { cylinder } from './cylinder.ts'
import { defaultIndentStr } from './defs.ts'
import { shapeBase, type Shape } from './shape.ts'
import { sphere } from './sphere.ts'
import { type Vector, vector } from './vector.ts'


export type CuboidEdges =
	| 'all'
	| 'bottom'
	| 'bottom+sides'
	| 'sides'
	| 'top'
	| 'top+sides'
	| 'top+bottom'
	| 'wheel' // like looking at a wheel if the chamfers 50% of the width and rounded
	| 'wheel-side'
	// TODO: maybe?
	// | number // specific edges, number from top to bottom, clockwise as if looking down from top
export type CuboidChamferOptions = {
	edges?: CuboidEdges // default: all
	radius?: number // default 0.6
}

// TODO: it might make more sense to make a module out of this whole business
// TODO: it might be nice to name these 'chamfered-cuboid' instead of 'hull' as well
// TODO: there are lots more options that could be implemented for where to place the
//    chamfers, especially with rounded
// TODO: probably a more general way to do this that has less duplication
// TODO: move `roundedCuboid` and `chamferedCuboid` to someplace the aren't exported in mod.ts
//    and remove them from all examples in favor of cuboid().round() or .chamfer()
export const roundedCuboid = (
	size: Vector,
	options?: CuboidChamferOptions,
): Shape => {
	const radius = options?.radius ?? 0.6
	const edges = options?.edges ?? 'all'

	if (edges === 'all') {
		return hull(
			...[radius, size.z - radius].flatMap(z => [radius, size.y - radius].flatMap(y => [radius, size.x - radius].map(x => sphere(radius).move(x, y, z)))),
		)
	}
	if (edges === 'sides') {
		return hull(
			...[radius, size.y - radius].flatMap(y => [radius, size.x - radius].map(x => cylinder(radius, size.z).move(x, y, 0)))
		)
	}
	if (edges === 'wheel') {
		return hull(
			...[radius, size.x - radius].flatMap(x => [radius, size.z - radius].map(z => cylinder({ radius, height: size.y }).rotate(90, 0, 0).move(x, size.y, z)))
		)
	}
	if (edges === 'wheel-side') {
		return hull(
			...[radius, size.y - radius].flatMap(y => [radius, size.z - radius].map(z => cylinder({ radius, height: size.x }).rotate(0, 90, 0).move(0, y, z)))
		)
	}
	throw Error(`unsupported edges value ${edges}`)

}

export const chamferedCuboid = (
	size: Vector,
	options?: CuboidChamferOptions,
): Shape => {
	const radius = options?.radius ?? 0.6
	const diameter = 2 * radius
	const edges = options?.edges ?? 'all'
	if (edges === 'all') {
		return hull(
			cuboid(size.subtract(vector(0, diameter, diameter))).move(0, radius, radius),
			cuboid(size.subtract(vector(diameter, 0, diameter))).move(radius, 0, radius),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'bottom') {
		return hull(
			cuboid(size.subtract(vector(0, 0, radius))).move(0, 0, radius),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'bottom+sides') {
		return hull(
			cuboid(size.subtract(vector(0, diameter, radius))).move(0, radius, radius),
			cuboid(size.subtract(vector(diameter, 0, radius))).move(radius, 0, radius),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'sides') {
		return hull(
			cuboid(size.subtract(vector(diameter, 0, 0))).move(radius, 0, 0),
			cuboid(size.subtract(vector(0, diameter, 0))).move(0, radius, 0),
		)
	}
	if (edges === 'top') {
		return hull(
			cuboid(size.subtract(vector(0, 0, radius))),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'top+sides') {
		return hull(
			cuboid(size.subtract(vector(0, diameter, radius))).move(0, radius, 0),
			cuboid(size.subtract(vector(diameter, 0, radius))).move(radius, 0, 0),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'top+bottom') {
		return hull(
			cuboid(size.subtract(vector(0, 0, diameter))).move(0, 0, radius),
			cuboid(size.subtract(vector(diameter, diameter, 0))).move(radius, radius, 0),
		)
	}
	if (edges === 'wheel') {
		return hull(
			cuboid(size.subtract(vector(diameter, 0, 0))).move(radius, 0, 0),
			cuboid(size.subtract(vector(0, 0, diameter))).move(0, 0, radius),
		)
	}
	if (edges === 'wheel-side') {
		return hull(
			cuboid(size.subtract(vector(0, diameter, 0))).move(0, radius, 0),
			cuboid(size.subtract(vector(0, 0, diameter))).move(0, 0, radius),
		)
	}
	throw Error('not yet implemented')
}

export type ChamferableCuboid = Shape & {
	round(options?: CuboidChamferOptions): Shape
	chamfer(options?: CuboidChamferOptions): Shape
}

export const cube = (wdh: number): ChamferableCuboid => {
	const retVal = {
		...shapeBase,
		name: 'cube',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr): string {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`cube(${this.addSpecialVariableArgs(wdh.toString())});\n`
		},
		round(options?: CuboidChamferOptions): Shape {
			return roundedCuboid(vector(wdh, wdh, wdh), options)
		},
		chamfer(options?: CuboidChamferOptions): Shape {
			return chamferedCuboid(vector(wdh, wdh, wdh), options)
		},
	}
	return retVal
}

export type CuboidFunc = {
	(size: Vector): ChamferableCuboid
	(w: number, d: number, h: number): ChamferableCuboid
}
export const cuboid: CuboidFunc = (
	xOrSize: number | Vector,
	y?: number,
	z?: number,
): ChamferableCuboid => {
	const size = typeof xOrSize === 'number' ? vector(xOrSize, y!, z!) : xOrSize
	const retVal = {
		...shapeBase,
		name: 'cuboid',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr) {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`cube(${this.addSpecialVariableArgs(`[${size.x}, ${size.y}, ${size.z}]`)});\n`
		},
		round(options?: CuboidChamferOptions): Shape {
			return roundedCuboid(size, options)
		},
		chamfer(options?: CuboidChamferOptions): Shape {
			return chamferedCuboid(size, options)
		},
	}
	return retVal
}
