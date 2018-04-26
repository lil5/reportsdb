// Dependencies
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const pdf = require('html-pdf');
const Sqlite = require('better-sqlite3');
const Big = require('big.js');
const csv = require('../node_modules/html2csv/lib/html2csv.js');

module.exports = class ReportsDB {
	constructor(
		templateFile,
		databaseFile,
		queryFile
	) {
		this.templateFile = templateFile;
		this.databaseFile = databaseFile;
		this.queryFile = queryFile;
	}

	checkFiles(arrFiles) {
		function isReadable(fp) {
			let result = false;
			let stats;
			let isFile = false;
			try {
				stats = fs.statSync(fp);
				isFile = stats.isFile();

				if (isFile && stats.mode & 40) {
					result = true;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
			return result;
		}

		let result = true;
		for (let i = 0; i < arrFiles.length; i++) {
			if (isReadable(arrFiles[i]) === false) {
				result = false;
				break;
			}
		}
		return result;
	}

	setOutputFile(outputFile) {
		this.outputFile = outputFile;
	}

	databaseToObject(moreQuery = '') {
		const db = new Sqlite(this.databaseFile, {
			readonly: true, fileMustExist: true
		});

		const query = fs.readFileSync(this.queryFile, 'utf8').replace(/(\r\n|\r|\n)/g, ' ') + moreQuery;

		return db.prepare(query).all();
	}

	pugToHtml(db) {
		const pugFunc = pug.compileFile(this.templateFile);

		let html = pugFunc({Big, db});

		html = pug.compileFile(path.join(__dirname, 'head.pug'))({}).replace('</body></html>', '') +
		html +
		'</body></html>';

		return html;
	}

	htmlToCsv(html) {
		csv.htmlToCSVs(html, (err, csvs) => {
			if (err) {
				return console.error(err);
			}

			switch (csvs.length) {
				case 1:
					fs.writeFileSync(this.outputFile, csvs[0]);
					break;
				case 0:
					console.error('No <table> tag found.');
					break;
				default:
					console.error('Adding more that one <table> in template is not yet supported');
					console.error(csvs);
			}
		});
	}

	htmlToHtml(html) {
		fs.writeFileSync(this.outputFile, html);
	}

	htmlToPdf(html) {
		const zm = 2;
		const options = {
			// "format": "A4",
			// "orientation": "portrait",
			height: (210 * zm) + 'mm',
			width: (297 * zm) + 'mm',

			border: (5 * zm) + 'mm'
		};

		pdf
			.create(html, options)
			.toFile(this.outputFile, err => {
				if (err) {
					return console.error(err);
				}
			});
	}
};
