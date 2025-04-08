import type { Value } from './defs.ts'
import type { Shape } from './shape.ts'


// Is this even a good idea? Allowing stuff like leads down a rabbit-hole of too-much-OpenSCAD
// code. The main use-case would be to allow use of the customizer but it would probably be better
// to support some sort of our own customizer to replace the one in OpenSCAD.

export type Arg = {
	name: string
	default?: Value
}

export type OpenSCADFunction = {
	name: string
	args: Arg[]
}

export type OpenSCADModule = {
	name: string
	args: Arg[]
	shape: Shape
}

export type OpenSCADRange = {
	start: number
	step?: number
	end: number
}

export type Document = {
	functions?: OpenSCADFunction[]
	modules?: OpenSCADModule[]
}
