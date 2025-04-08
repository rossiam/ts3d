import { hull } from './containers.ts'
import { defaultIndentStr } from './defs.ts'
import { shapeBase, type Shape } from './shape.ts'


export type ConeOptions =
	| { radius: number, height: number }
	| { diameter: number, height: number }
export type ConeFunc = {
	(radius: number, height: number): Shape
	(options: { radius: number, height: number }): Shape
	(options: { diameter: number, height: number }): Shape
}
export const cone: ConeFunc = (
	optionsOrRadius: ConeOptions | number,
	height?: number,
): Shape => {
	const buildCylinderArgs = (): string => {
		if (typeof optionsOrRadius === 'number') {
			return `r1=${optionsOrRadius}, r2=0, h=${height}`
		}
		if ('radius' in optionsOrRadius) {
			return `r1=${optionsOrRadius.radius}, r2=0, h=${optionsOrRadius.height}`
		}
		if ('diameter' in optionsOrRadius) {
			return `d1=${optionsOrRadius.diameter}, d2=0, h=${optionsOrRadius.height}`
		}
		throw Error('invalid arguments to cone')
	}
	const retVal = {
		...shapeBase,
		name: 'cone',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr) {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`cylinder(${this.addSpecialVariableArgs(buildCylinderArgs())});\n`
		},
	}
	return retVal
}

export type CylinderEdges = 'top' | 'bottom' | 'both'
export type CylinderChamferOptions = {
	edges?: CylinderEdges // default: both
	radius?: number // default 0.6
	// TODO: will need to be more complicated (rotate extrude spheres at top and bottom and hull them?)
	// rounded?: boolean // default is false
}
export type ChamferableCylinder = Shape & {
	chamfer(chamferOption?: CylinderChamferOptions): Shape
}
// TODO: share with ConeOptions?
export type CylinderOptions =
	| { radius: number, height: number }
	| { diameter: number, height: number }
// TODO: share with ConeFunc?
export type CylinderFunc = {
	(radius: number, height: number): ChamferableCylinder
	(options: { radius: number, height: number }): ChamferableCylinder
	(options: { diameter: number, height: number }): ChamferableCylinder
}

export type ChamferedCylinderOptions = CylinderOptions & Omit<CylinderChamferOptions, 'radius'> & {
	// We'll use `radius` for the cylinder radius
	chamferRadius?: number
}
// TODO: maybe don't include this? .cylinder().chamfer() is nicer IMO
export const chamferedCylinder = (options: ChamferedCylinderOptions): Shape => {
	const chamferRadius = options?.chamferRadius ?? 0.6
	const edges = options?.edges ?? 'both'
	// const radius = ('radius' in options) ? options.radius : undefined
	const diameter = ('diameter' in options) ? options.diameter : options.radius * 2
	const height = options.height
	return hull(
		cylinder({ diameter: diameter - 2 * chamferRadius, height }),
		cylinder({
			diameter,
			height: height - (edges === 'both' ? 2 : 1) * chamferRadius,
		}).move(0, 0, edges === 'top' ? 0 : chamferRadius),
	)
}

export const cylinder: CylinderFunc = (
	optionsOrRadius: CylinderOptions | number,
	height?: number,
): ChamferableCylinder => {
	const optionsFromArgs = () => {
		if (typeof optionsOrRadius === 'number') {
			if (height === undefined) {
				throw Error('height required for a cylinder')
			}
			return { radius: optionsOrRadius, height }
		}
		return optionsOrRadius
	}
	if (typeof optionsOrRadius === 'number' && height === undefined) {
		throw Error('')
	}
	const options = optionsFromArgs()
	const buildCylinderArgs = (): string => {
		if ('radius' in options) {
			return `r=${options.radius}, h=${options.height}`
		}
		if ('diameter' in options) {
			return `d=${options.diameter}, h=${options.height}`
		}
		throw Error('invalid arguments to cylinder')
	}
	const retVal = {
		...shapeBase,
		name: 'cylinder',
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr) {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`cylinder(${this.addSpecialVariableArgs(buildCylinderArgs())});\n`
		},
		chamfer(chamferOptions?: CylinderChamferOptions): Shape {
			const chamferedCylinderOptions: ChamferedCylinderOptions = {
				...chamferOptions,
				...options,
				chamferRadius: chamferOptions?.radius,
			}
			return chamferedCylinder(chamferedCylinderOptions)
		}
	}
	return retVal
}


export type FrustumByRadiusOptions = {
	radius1: number
	radius2: number
	height: number
}
export type FrustumByDiameterOptions = {
	diameter1: number
	diameter2: number
	height: number
}
export type FrustumOptions =
	| FrustumByRadiusOptions
	| FrustumByDiameterOptions

export const frustum = (frustumOptions: FrustumOptions): Shape => {
	const buildCylinderArgs = (): string => {
		if ('radius1' in frustumOptions) {
			return `r1=${frustumOptions.radius1}, r2=${frustumOptions.radius2}, h=${frustumOptions.height}`
		}
		if ('diameter1' in frustumOptions) {
			return `d1=${frustumOptions.diameter1}, d2=${frustumOptions.diameter2}, h=${frustumOptions.height}`
		}
		return ''
	}
	const retVal = {
		...shapeBase,
		generateCAD(indentLevel: number = 0, indentStr = defaultIndentStr) {
			return `${indentStr.repeat(indentLevel)}${this.prefixChars}` +
				`cylinder(${this.addSpecialVariableArgs(buildCylinderArgs())});\n`
		}
	}
	return retVal
}
