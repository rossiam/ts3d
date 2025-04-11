// TODO: Make this an example importing from jsr directly
import { difference, union } from '../src/container.ts'
import { cube, cuboid } from '../src/cuboid.ts'
import { cone, cylinder, frustum } from '../src/cylinder.ts'
import { move } from '../src/modifier.ts'
import { sphere } from '../src/sphere.ts'
import { range } from '../src/util.ts'
import { vector as v } from '../src/vector.ts'


const randomThing = difference(
	union(
		cuboid(100, 50, 25).round({ edges: 'all', radius: 4 }).move(0, -100, 0),
		cuboid(v(200, 200, 40)).chamfer({ radius: 4 }),
		move(10, 10, 10, cuboid(v(20, 20, 80)).chamfer({ radius: 3, edges: 'top' })),
		move(180, 180, -50, cuboid(30, 10, 100)).debug(),
		cuboid(50, 10, 100).move(-15, 160, -10).fn(144),
		cube(30)
			.chamfer({ radius: 4, edges: 'sides' })
			// .specialVariable({ name: '$test', value: ['string', 5]})
			.move(15, 150, 50),
		cylinder(10, 50).chamfer({ radius: 4, edges: 'bottom' }).move(4, 4, 0),
		cylinder(10, 80).fn(3).move(50, 50, -20).color('grey'),
		cone(30, 40).fn(8).move(0, 100, 0),
		frustum({ radius1: 10, radius2: 20, height: 70 }).fn(6).move(200, 0, 0),
		difference(
			sphere(30).fn(12),
			cube(62).move(-31, -31, -62),
		).move(100, 0, 0),
		cuboid(50, 15, 20).chamfer({ edges: 'wheel', radius: 5 }).move(10, -9, 0),
		cuboid(15, 50, 20).round({ edges: 'wheel-side', radius: 7 }).move(-9, 10, 0),
	),
	cube(42).move(111, 11, -1),
	cube(42).chamfer({ radius: 3, edges: 'sides' }).move(90, 32, -1),
	cuboid(32, 16, 42).round({ radius: 4, edges: 'sides' }).move(20, 100, -1),
	move(100, 100, -1, cylinder(12.5, 42)),
)

const r = range(1, 5)
for (const index of r) {
	console.log(`index = ${index}`)
}

for (const secondIndex of r) {
	console.log(`secondIndex = ${secondIndex}`)
}

const variables = {
	'$fn': 60,
	chamfer_radius: 0.6,
}
randomThing.writeCADAndRender({ filename: 'renders/random-thing.scad', variables })
