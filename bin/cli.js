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
	if ('select' in options) {
		// Will only order by date if no year is given
		moreQuery = ` ORDER BY date(${options.select}) DESC`;

		// Filter by year and quater
		if ('year' in options && 'quater' in options) {
			const year = parseInt(options.year, 10);
			const quater = options.quater === '1' ?
				{start: '01-01', stop: '03-31'} : options.quater === '2' ?
					{start: '04-01', stop: '06-30'} : options.quater === '3' ?
						{start: '07-01', stop: '09-30'} :
						{start: '10-01', stop: '12-31'};
			moreQuery = `WHERE ${options.select} BETWEEN '${year}-${quater.start}' AND '${year}-${quater.stop}'${moreQuery}`;

			// Add output filename
			outputFilename = options.year + '-' + options.quater;
		} else if ('year' in options) {
			// Filter by year and quater
			const year = parseInt(options.year, 10);
			moreQuery = `WHERE ${options.select} BETWEEN '${year}' AND '${year + 1}'${moreQuery}`;

			// Add output filename
			outputFilename = options.year;
		}
	}

	return {
		outputFilename,
		moreQuery
	};
}

program
	.version('1.1.0');

program
	.command('toPDF <template>')
	.description('run template and output a .pdf')
	.option('-y, --year <YYYY>', 'Year', /\d{4}/)
	.option('-q, --quater <Q>', 'Quater (1-4)', /[1-4]/)
	.option('-s, --select <string>', 'column name for date pointers')
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
	.option('-y, --year <YYYY>', 'Year', /\d{4}/)
	.option('-q, --quater <Q>', 'Quater (1-4)', /[1-4]/)
	.option('-s, --select <string>', 'column name for date pointers')
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
	.option('-y, --year <YYYY>', 'Year', /\d{4}/)
	.option('-q, --quater <Q>', 'Quater (1-4)', /[1-4]/)
	.option('-s, --select <string>', 'column name for date pointers')
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
