import { combinator } from './combinator.ts'
import type { Shape } from './shape.ts'
import type { Vector } from './vector.ts'


// TODO: loops?

export type MoveFunc = {
	(offset: Vector, shape: Shape, ...shapes: (Shape | undefined | null)[]): Shape
	(x: number, y: number, z: number, shape: Shape, ...shapes: (Shape | undefined | null)[]): Shape
}
export const move: MoveFunc = (
	offsetOrX: Vector | number,
	shapeOrY: Shape | number,
	shapeOrZ: Shape | number | undefined | null,
	shape?: Shape | undefined | null,
	...children: (Shape | undefined | null)[]
) => {
	if (typeof offsetOrX === 'number') {
		if (!shape) {
			throw Error('At least one shape is required.')
		}
		return combinator('translate', `[${offsetOrX}, ${shapeOrY}, ${shapeOrZ}]`, shape, ...children)
	}
	// TODO: more error checking for JS folks here
	const allShapes: (Shape | undefined | null)[] = [shapeOrY as Shape]
	if (shapeOrZ) {
		allShapes.push(shapeOrZ as Shape)
	}
	if (shape) {
		allShapes.push(shape)
	}
	allShapes.push(...children)
	// TODO: would there be any benefit from naming this `moved-${singleChild.name | 'union'}
	return combinator('translate', `[${offsetOrX.x}, ${offsetOrX.y}, ${offsetOrX.z}]`, ...children)
}
export const translate = move

// TODO: accept vector or numbers like move
// TODO: would there be any benefit from naming this `rotated-${singleChild.name | 'union'}
export const rotate = (angles: Vector, ...shapes: (Shape | undefined | null)[]): Shape =>
	combinator('rotate', `[${angles.x}, ${angles.y}, ${angles.z}]`, ...shapes)
// color

export const scale = (by: Vector, ...shapes: (Shape | undefined | null)[]): Shape =>
	combinator('scale', `[${by.x}, ${by.y}, ${by.z}]`, ...shapes)
// TODO: support "auto" parameter
export const resize = (to: Vector, ...shapes: (Shape | undefined | null)[]): Shape =>
	combinator('resize', `[${to.x}, ${to.y}, ${to.z}]`, ...shapes)
