import { defaultIndentStr } from './defs.ts'
import { shapeBase, type Shape } from './shape.ts'


export const circle = (radius: number): Shape => {
	const retVal = {
		...shapeBase,
		name: 'circle',
		type: '2D' as const,
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr): string {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`circle(${this.addSpecialVariableArgs(`r=${radius}`)});\n`
		},
	}
	return retVal
}
