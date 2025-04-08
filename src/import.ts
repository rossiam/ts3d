import { defaultIndentStr } from './defs.ts'
import { type Shape, shapeBase } from './shape.ts'


export const importFrom = (filename: string): Shape => {
	const retVal = {
		...shapeBase,
		name: 'import',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr): string {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				// TODO: do we want `addSpecialVariableArgs` for this one?
				`import(${this.addSpecialVariableArgs(`"${filename}"`)});\n`
		},
	}
	return retVal
}
