const path = require('path');
const fs = require('fs-extra');

function init(dir) {
	const outDir = path.isAbsolute(dir) ?
		dir :
		path.join(process.cwd(), dir);

	const inDir = path.join(__dirname, '../examples/');

	try {
	fs.copySync(inDir, outDir, {overwrite: false});
	} catch (e) {
	console.error(e);
	}
}

module.exports = init;
