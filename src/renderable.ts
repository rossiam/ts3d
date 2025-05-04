// TODO: detect by default; allow user to configure
const openSCADBinary = '/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD'

export type RenderOptions = {
	outputFormat: 'stl' | 'binary-stl'
}
export type Renderable = {
	render(options?: RenderOptions): Promise<void>
}

export const defaultRenderable = (filename: string): Renderable => ({
	async render(options?: RenderOptions): Promise<void> {
		console.log('render - enter')
		// TODO: allow argument to renderToSTL
		const outputFilename = `${filename.replace(/\.[^.]+$/, '')}.stl`
		console.log(`running command to write file ${outputFilename}`)
		const command = new Deno.Command(openSCADBinary, {
			args: [
				filename,
				'-o', outputFilename,
				'--export-format', options?.outputFormat === 'binary-stl' ? 'binstl' : 'asciistl',
				// '--enable', 'fast-csg',
				// '--enable', 'manifold',
				'--backend=manifold',
			],
		})

		console.log('waiting for output')
		const { code, stdout, stderr } = await command.output()

		if (stdout.length) {
			console.log(new TextDecoder().decode(stdout))
		}
		if (stderr.length) {
			console.log(new TextDecoder().decode(stderr))
		}
		if (code !== 0) {
			throw Error(`failed to render ${filename} to ${outputFilename}`, )
		}
	}
})
