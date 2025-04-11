import { combinator } from './combinator.ts'
import type { Shape } from './shape.ts'


// TODO: is there a way we can require the inputs to be the same as the outputs with generics?
export const union = (...children: (Shape | undefined | null)[]): Shape =>
	combinator('union', '', ...children)
export const intersection = (...children: (Shape | undefined | null)[]): Shape =>
	combinator('intersection', '', ...children)
// TODO: consider two sets of shapes for difference
export const difference = (...children: (Shape | undefined | null)[]): Shape =>
	combinator('difference', '', ...children)
export const hull = (...children: (Shape | undefined | null)[]): Shape =>
	combinator('hull', '', ...children)
// minkowski
// 2d versions
