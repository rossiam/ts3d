import { defaultIndentStr } from './defs.ts'
import { linearExtrude } from './linear-extrude.ts'
import { shapeBase, type Shape } from './shape.ts'


export type TextOptions = {
	text: string
	size?: number
	font?: string
	halign?: 'left' | 'center' | 'right' // default is 'left'
	valign?: 'top' | 'center' | 'baseline' | 'bottom' // default is 'baseline'
	spacing?: number
	direction?: 'ltr' | 'rtl' | 'ttb' | 'btt' // default is 'ltr'
	language?: string // default is 'en'
	script?: string // default is 'latin'
}
// TODO: need Shape2D for this so move, etc. takes only x and y
export const text = (options: TextOptions): Shape => {
	let args = `text = "${options.text}"`
	if (options.size) {
		args += `, size = ${options.size}`
	}
	if (options.font) {
		args += `, font = "${options.font}"`
	}
	if (options.halign) {
		args += `, halign = "${options.halign}"`
	}
	if (options.valign) {
		args += `, valign = "${options.valign}"`
	}
	if (options.spacing) {
		args += `, spacing = ${options.spacing}`
	}
	if (options.direction) {
		args += `, direction = "${options.direction}"`
	}
	if (options.language) {
		args += `, language = "${options.language}"`
	}
	if (options.script) {
		args += `, script = "${options.script}"`
	}
	return {
		...shapeBase,
		name: 'text',
		type: '2D',
		generateCAD: (indentLevel: number = 0, indentStr = defaultIndentStr) =>
			`${indentStr.repeat(indentLevel)}text(${args});\n`,
	}
}

export type Text3DOptions =
	& TextOptions
	& {
		thickness: number
	}
export const text3D = (options: Text3DOptions): Shape => {
	return linearExtrude({ height: options.thickness }, text(options))
}
