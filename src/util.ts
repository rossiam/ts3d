import { union } from './container.ts'
import type { Shape } from './shape.ts'


export const atCorners = (x1: number, x2: number, y1: number, y2: number, shape: Shape): Shape =>
	union(
		shape.move(x1, y1, 0),
		shape.move(x2, y1, 0),
		shape.move(x1, y2, 0),
		shape.move(x2, y2, 0),
	)

export type Range = Iterable<number> & {
	start: number
	end: number
	step: number
	toString(): string
}
export type RangeOptions = {
	step?: number,
	startInclusive?: boolean // default is true
	endInclusive?: boolean // default is false
}
export const range = (
	start: number,
	end: number,
	options?: RangeOptions,
): Range => {
	const step = options?.step ?? 1
	const startInclusive = options?.startInclusive ?? true
	const endInclusive = options?.endInclusive ?? false
	return {
		get start(): number { return start },
		get end(): number { return end },
		get step(): number { return step },
		[Symbol.iterator]: (): Iterator<number> => {
			let nextValue = start + (startInclusive ? 0 : step)
			return {
				next: (): IteratorResult<number> => {
					const retVal = nextValue
					nextValue += step
					return { value: retVal, done: endInclusive ? nextValue > end + step : nextValue >= end + step }
				}
			}
		},
		toString(): string { return `${start}:${step}:${end}` }
	}
}
