import { writeAll } from '@std/io/write-all'
import { combinator } from './combinator.ts'
import { renderValue, type Value, type Variable } from './defs.ts'
import { defaultRenderable, type Renderable } from './renderable.ts'
import type { Vector } from './vector.ts'


// export type HexChar =
// 	'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
export type ColorSpec =
	| string
	// | '#${string}${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}${HexChar}'
	| { red: number, green: number, blue: number, alpha?: number }
export type WriteOptions = {
	filename: string
	variables?: { [name: string]: Value }
}

// Not really protected but good enough for me.
export type ProtectedShape = {
	prefixChars: string
	specialVariables?: Variable[]

	addSpecialVariableArgs(regularArgs?: string): string
}

export type ChainMoveFunc = {
	(offset: Vector): Shape
	(x: number, y: number, z?: number): Shape
}
export type ChainRotateFunc = {
	(angle: Vector): Shape
	(x: number, y: number, z: number): Shape
}

export type ChainScaleFunc = {
	(by: Vector): Shape
	(x: number, y: number, z?: number): Shape
}

// TODO: add support for extra `auto` parameter
export type ChainResizeFunc = {
	(to: Vector): Shape
	(x: number, y: number, z?: number): Shape
}

export type Shape = {
	name: string
	type: '2D' | '3D'
	generateCAD: (indentLevel?: number, indentStr?: string) => string
	// TODO: customizer options
	// TODO:
	//   - modules
	//   - functions
	//   - imports
	//   - variables?
	// prerequisites: () => Module[]

	color(colorSpec: ColorSpec): Shape
	debug(): Shape
	specialVariable(variable: Variable): Shape
	fn(value: number): Shape

	writeCAD(options: WriteOptions): Promise<Renderable>
	writeCADAndRender(options: WriteOptions): Promise<void>

	move: ChainMoveFunc
	rotate: ChainRotateFunc
	scale: ChainScaleFunc
	resize: ChainResizeFunc
}

export const shapeBase: Shape & ProtectedShape = {
	name: '',
	type: '3D',
	prefixChars: '',
	specialVariables: undefined,

	generateCAD() {
		throw `shapeBase is abstract, use implementation`
	},

	color(colorSpec: ColorSpec): Shape {
		if (typeof colorSpec === 'string') {
			return combinator('color', `"${colorSpec}"`, this)
		}
		const args = `[${colorSpec.red}, ${colorSpec.green}, ${colorSpec.blue}` +
			colorSpec.alpha ? `, ${colorSpec.alpha}]` : ']'
		return combinator('color', `"${args}"`, this)
	},

	debug(): Shape {
		this.prefixChars = '#'
		return this
	},
	specialVariable(variable: Variable): Shape {
		if (!this.specialVariables) {
			this.specialVariables = [variable]
		} else {
			this.specialVariables.push(variable)
		}
		return this
	},
	fn(value: number): Shape {
		return this.specialVariable({ name: '$fn', value })
	},
	// TODO: showOnly (prefix char = !)
	// TODO: disable (prefix char = *)
	// TODO: transparent/background (prefix char = %)
	// TODO: addArg and probably even $fn or fn
	// TODO: write

	async writeCAD(options: WriteOptions): Promise<Renderable> {
		// maybe also allow from chained functions
		const specialVariables = options.variables ? { ...options.variables } : {}
		const bytes = new TextEncoder().encode(
			Object.entries(specialVariables).map(([name, value]) => `${name} = ${value};`).join(
				'\n',
			) + '\n' + this.generateCAD(),
		)
		using file = await Deno.open(options.filename, {
			write: true,
			create: true,
			truncate: true,
		})
		await writeAll(file, bytes)

		return defaultRenderable(options.filename)
	},

	async writeCADAndRender(options: WriteOptions): Promise<void> {
		(await this.writeCAD(options)).render()
	},

	addSpecialVariableArgs(regularArgs?: string): string {
		const svArgs = this.specialVariables
			?.map(({ name, value }) => `${name}=${renderValue(value)}`).join(', ')
		if (regularArgs) {
			if (svArgs) {
				return `${regularArgs}, ${svArgs}`
			}
			return regularArgs
		}
		return svArgs ?? ''
	},

	move(xOrOffset: number | Vector, y?: number, z?: number): Shape {
		if (typeof xOrOffset === 'number') {
			return combinator('translate', `[${xOrOffset}, ${y}, ${z}]`, this)
		}
		return combinator(
			'translate',
			`[${xOrOffset.x}, ${xOrOffset.y}${xOrOffset.z ? `, ${xOrOffset.z}` : ''}]`,
			this,
		)
	},
	rotate(xOrAngle: number | Vector, y?: number, z?: number): Shape {
		if (typeof xOrAngle === 'number') {
			return combinator('rotate', `[${xOrAngle}, ${y}, ${z}]`, this)
		}
		return combinator(
			'rotate',
			`[${xOrAngle.x}, ${xOrAngle.y}, ${xOrAngle.z}]`,
			this,
		)
	},
	scale(by: number | Vector, y?: number, z?: number): Shape {
		if (typeof by === 'number') {
			return combinator('scale', `[${by}, ${y}, ${z}]`, this)
		}
		return combinator(
			'scale',
			`[${by.x}, ${by.y}${by.z ? `, ${by.z}` : ''}]`,
			this,
		)
	},
	resize(to: number | Vector, y?: number, z?: number): Shape {
		if (typeof to === 'number') {
			return combinator('scale', `[${to}, ${y}, ${z ?? 0}]`, this)
		}
		return combinator(
			'resize',
			`[${to.x ?? 0}, ${to.y ?? 0}, ${to.z ?? 0}]`,
			this,
		)
	},
	// subtract
	// intersect
	// add
}
