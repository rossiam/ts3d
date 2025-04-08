import { cuboid, sphere, union } from '../mod.ts'

const simple = union(
	sphere(10),
	cuboid(30, 10, 15),
)

simple.writeCADAndRender({ filename: 'renders/simple.scad', variables: { '$fn': 60 } })
