import { shapeBase, type Shape } from './shape.ts'
import { defaultIndentStr } from './defs.ts'


export const combinator = (
	combinatorFuncName: string,
	combinatorArgs: string,
	...children: (Shape | undefined | null)[]
): Shape => {
	const definedChildren = children.filter(child => child != null)
	const retVal = {
		...shapeBase,
		name: combinatorFuncName,
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr): string {
			const indent = indentStr.repeat(indentLevel)
			return `${indent}${this.prefixChars}` +
				`${combinatorFuncName}(${this.addSpecialVariableArgs(combinatorArgs)}) {\n` +
			definedChildren.map((child: Shape) =>
					child.generateCAD(indentLevel + 1, indentStr)
				).join('') +
				`${indent}}\n`
		},
	}
	return retVal
}
