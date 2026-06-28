import { which } from '@david/which'


// Attempt to find the OpenSCAD executable on Linux, macOS, or Windows.
//
// Search order:
//   1. explicit override via the OPENSCAD environment variable
//   2. on PATH (using hopefully-correct OS-specific names)
//   3. common platform-specific install locations

const onWindows = Deno.build.os === 'windows'

const possibleBinaryNames = onWindows
	? ['openscad.exe', 'openscad-nightly.exe']
	: ['openscad', 'openscad-nightly', 'OpenSCAD']

// Locations to search if not found on path.
const knownLocations: string[] = ((): string[] => {
	if (Deno.build.os === 'darwin') {
		return [
			'/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD',
			'/Applications/OpenSCAD-nightly.app/Contents/MacOS/OpenSCAD',
		]
	} else if (Deno.build.os === 'linux') {
		// TODO: verify and test these locations
		return [
			'/usr/bin/openscad',
			'/usr/local/bin/openscad',
			'/snap/bin/openscad',
			'/var/lib/flatpak/exports/bin/org.openscad.OpenSCAD',
		]
	} else if (Deno.build.os === 'windows') {
		// This is a guess, I don't have a Windows machine to test on.
		return [
			'C:\\Program Files\\OpenSCAD\\openscad.exe',
			'C:\\Program Files (x86)\\OpenSCAD\\openscad.exe',
		]
	} else {
		throw new Error(`Unsupported OS: ${Deno.build.os}`)
	}
})()


const existsAndIsFile = async (path: string): Promise<boolean> => {
	try {
		return (await Deno.stat(path)).isFile
	} catch (error) {
		if (error instanceof Deno.errors.NotFound) {
			return false
		}
		throw error
	}
}

const findOnSearchPath = async (): Promise<string | undefined> => {
	for (const name of possibleBinaryNames) {
		const foundBinaryName = await which(name)
		if (foundBinaryName) {
			return foundBinaryName
		}
	}
	return undefined
}

/**
 * Find the OpenSCAD binary. Pass an explicit path/override to short-circuit,
 * otherwise the env var, PATH, and known locations are tried in turn.
 */
export const findOpenSCAD = async (): Promise<string> => {
	// TODO: verify version (must be dev snapshot or nightly for now since we use manifold rendering)
	const from_env = Deno.env.get('OPENSCAD_BINARY')
	if (from_env) {
		if (await existsAndIsFile(from_env)) {
			return from_env
		}
		throw new Error(`OpenSCAD binary not found at configured path: ${from_env}`)
	}

	const onPath = await findOnSearchPath()
	if (onPath) {
		return onPath
	}

	for (const candidate of knownLocations ?? []) {
		if (await existsAndIsFile(candidate)) {
			return candidate
		}
	}

	throw new Error(
		'Could not find the OpenSCAD binary. Ensure it is installed and if I still can\'t find it, ' +
			'set the OPENSCAD_BINARY environment variable to its full path. You must use a ' +
			'development snapshot or nightly build of OpenSCAD.',
	)
}
