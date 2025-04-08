import { defaultIndentStr } from './defs.ts'
import { shapeBase, type Shape } from './shape.ts'


export const sphere = (radius: number): Shape => {
	const retVal = {
		...shapeBase,
		name: 'sphere',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr): string {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`sphere(${this.addSpecialVariableArgs(`r=${radius}`)});\n`
		},
	}
	return retVal
}
