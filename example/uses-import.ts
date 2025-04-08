import { difference, importFrom, sphere } from '../mod.ts'

const simple = difference(
	importFrom('../example/simple-cuboid.stl'),
	sphere(10),
)

simple.writeCADAndRender({ filename: 'renders/uses-import.scad', variables: { '$fn': 60 } })
