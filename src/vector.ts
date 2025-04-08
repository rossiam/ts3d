/**
 * A representation of a 3D TODO:
 *
 * Not a array as in OpenSCAD.
 */
export type Vector = {
	x: number
	y: number
	z: number
	add(v2: Vector): Vector
	subtract(v2: Vector): Vector
	negate(): Vector
	scale(ratio: number): Vector
	equals(v2: Vector): boolean
}

export const vector = (x: number, y: number, z: number): Vector => ({
	x, y, z,
	// TODO: allow listing x, y, and z
	add: (v2: Vector): Vector => vector(x + v2.x, y + v2.y, z + v2.z),
	subtract: (v2: Vector): Vector => vector(x - v2.x, y - v2.y, z - v2.z),
	// TODO: name? (flip or something more technical?)
	negate: (): Vector => vector(-x, -y, -z),
	scale: (ratio: number): Vector => vector(-x * ratio, -y * ratio, -z * ratio),
	// TODO: add fudge factor parameter?
	equals: (v2: Vector): boolean => x === v2.x && y === v2.y && z === v2.z,
})


/**
 * A representation of a 2D TODO:
 *
 * Not a array as in OpenSCAD.
 */
export type Vector2D = {
	x: number
	y: number
	add(v2: Vector2D): Vector2D
	subtract(v2: Vector2D): Vector2D
	negate(): Vector2D
	scale(ratio: number): Vector2D
	equals(v2: Vector2D): boolean
}

export const vector2d = (x: number, y: number): Vector2D => ({
	x, y,
	add: (v2: Vector2D): Vector2D => vector2d(x + v2.x, y + v2.y),
	subtract: (v2: Vector2D): Vector2D => vector2d(x - v2.x, y - v2.y),
	negate: (): Vector2D => vector2d(-x, -y),
	scale: (ratio: number): Vector2D => vector2d(-x * ratio, -y * ratio),
	// TODO: add fudge factor parameter?
	equals: (v2: Vector2D): boolean => x === v2.x && y === v2.y,
})
