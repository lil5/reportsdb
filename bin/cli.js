#!/usr/bin/env node

// Dependencies
const path = require('path');
const program = require('commander');
const ReportsDB = require('../src');
const init = require('../src/init.js');

function createFileVars(templateDir) {
	return {
		templateFile: path.join(templateDir, 'html.pug'),
		databaseFile: path.join(templateDir, '../../db.sqlite'),
		queryFile: path.join(templateDir, 'query.sql'),
		outputDir: path.join(templateDir, '../../reports/')
	};
}

function moreQueryAndOutputFilename(options) {
	let moreQuery = '';
	let outputFilename = 'report';
	if (
		'd1' in options &&
		'd2' in options &&
		'dp' in options
	) {
		const regexDate = /\d{4}-[0-1]\d-[0-3]\d/;
		if (
			regexDate.test(options.d1) &&
			regexDate.test(options.d2)
		) {
			// Render added query
			moreQuery = `WHERE ${options.dp} BETWEEN '${options.d1}' AND '${options.d2}' ORDER BY date(${options.dp}) DESC`;

			// Add output filename
			outputFilename = options.d1 + '_' + options.d2;
		}
	}

	return {
		outputFilename,
		moreQuery
	};
}

program
	.version('1.0.0');

program
	.command('toPDF <template>')
	.description('run template and output a .pdf')
	.option('--d1 <YYYY-MM-DD>', 'day start')
	.option('--d2 <YYYY-MM-DD>', 'day end')
	.option('--dp <string>', 'column name for day pointers')
	.action((template, options) => {
		// Set full paths
		const templateDir = path.isAbsolute(template) ?
			template :
			path.join(process.cwd(), template);
		const myFiles = createFileVars(templateDir);

		const step0 = moreQueryAndOutputFilename(options);

		const reportsDBinst = new ReportsDB(
			myFiles.templateFile,
			myFiles.databaseFile,
			myFiles.queryFile
		);

		reportsDBinst.setOutputFile(
			path.join(myFiles.outputDir, step0.outputFilename + '.pdf')
		);

		const step1 = reportsDBinst.databaseToObject(step0.moreQuery);
		const step2 = reportsDBinst.pugToHtml(step1);
		reportsDBinst.htmlToPdf(step2);
	});

program
	.command('toCSV <template>')
	.description('run template and output a .csv')
	.option('--d1 <YYYY-MM-DD>', 'day start', /\d{4}-[1-3]\d-\d\d/)
	.option('--d2 <YYYY-MM-DD>', 'day end', /\d{4}-[1-3]\d-\d\d/)
	.option('--dp <string>', 'column name for day pointers')
	.action((template, options) => {
		// Set full paths
		const templateDir = path.isAbsolute(template) ?
			template :
			path.join(process.cwd(), template);
		const myFiles = createFileVars(templateDir);

		const step0 = moreQueryAndOutputFilename(options);

		const reportsDBinst = new ReportsDB(
			myFiles.templateFile,
			myFiles.databaseFile,
			myFiles.queryFile
		);

		reportsDBinst.setOutputFile(
			path.join(myFiles.outputDir, step0.outputFilename + '.csv')
		);

		const step1 = reportsDBinst.databaseToObject(step0.moreQuery);
		const step2 = reportsDBinst.pugToHtml(step1);
		reportsDBinst.htmlToCsv(step2);
	});

program
	.command('toHTML <template>')
	.description('run template and output a .csv')
	.option('--d1 <YYYY-MM-DD>', 'day start', /\d{4}-[1-3]\d-\d\d/)
	.option('--d2 <YYYY-MM-DD>', 'day end', /\d{4}-[1-3]\d-\d\d/)
	.option('--dp <string>', 'column name for day pointers')
	.action((template, options) => {
		// Set full paths
		const templateDir = path.isAbsolute(template) ?
			template :
			path.join(process.cwd(), template);
		const myFiles = createFileVars(templateDir);

		const step0 = moreQueryAndOutputFilename(options);

		const reportsDBinst = new ReportsDB(
			myFiles.templateFile,
			myFiles.databaseFile,
			myFiles.queryFile
		);

		reportsDBinst.setOutputFile(
			path.join(myFiles.outputDir, step0.outputFilename + '.html')
		);

		const step1 = reportsDBinst.databaseToObject(step0.moreQuery);
		const step2 = reportsDBinst.pugToHtml(step1);
		reportsDBinst.htmlToHtml(step2);
	});

program
	.command('test <template>')
	.description('test if everything is there and output pug value of db')
	.action(template => {
		// Set full paths
		const templateDir = path.isAbsolute(template) ?
			template :
			path.join(process.cwd(), template);

		const myFiles = createFileVars(templateDir);

		const reportsDBinst = new ReportsDB(
			myFiles.templateFile,
			myFiles.databaseFile,
			myFiles.queryFile
		);

		const isEverythingThere = reportsDBinst.checkFiles([
			myFiles.templateFile,
			myFiles.databaseFile,
			myFiles.queryFile
		]);
		if (!isEverythingThere) {
			console.log('Could not find a file/directory.');
			return;
		}
		console.log('All files found.');

		const obj = reportsDBinst.databaseToObject();

		console.log('\ndb[0]:');
		console.log(JSON.stringify(obj[0], null, 4));
	});

program
	.command('init <dir>')
	.description('Copies example to dir')
	.action(dir => {
		init(dir);
	});

program.parse(process.argv);
