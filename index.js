#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const commander = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const figures = require('figures');
const logSymbols = require('log-symbols');
const clear = require('console-clear');
const templates = require('./templates.json');
const settings = require('./settings.json');

clear();

const log = console.log;
const fromEnv = settings.pathToSaveFile;
const pathToSaveFile = process.env[fromEnv];
const hello = figlet.textSync('CLI helper', {
    font: 'ANSI Shadow',
    width: 80,
    whitespaceBreak: true
});

log(hello);
pathToSaveFile
	? log(chalk.green(`You have path for save files: ${pathToSaveFile}`))
	: log(chalk.red(`You don't have the path to save files!`))


commander
	.version('0.0.1')
	.description('Create files with code from templates.');

commander
	.command('create')
	.alias('c')
	.description('Create file with code from template.')
	.action(() => {
		const templatesChoices = templates.map(value => value.name);
		const q = [
			{ type: 'input', name: 'fileName', message: 'What the file name?: '},
			{ type: 'list', name: 'templateName', message: 'Select the template:', choices: templatesChoices },
			{ type: 'confirm', name: 'createFolder', message: 'Need create folder?: '},
		];
		inquirer
			.prompt(q)
			.then(answers => {
				const dir = path.join(pathToSaveFile, answers.fileName);
				const correctFileName = answers.fileName + path.extname(answers.templateName);
				const saveFile = path.join(dir, correctFileName);
				const templateForRead = path.join(__dirname, 'templates', answers.templateName);
				if (answers.createFolder) {
					if (!fs.existsSync(dir)){
						fs.mkdirSync(dir);
					}
				}
				process.chdir(dir);
				const codeFromTamplate = fs.readFileSync(templateForRead, 'utf8');
				fs.writeFile(saveFile, codeFromTamplate, err => {
					if (err) console.error(err);
					log(chalk.green(`Success! ${chalk.red(figures.heart)}`));
					log(chalk.green(`File "${chalk.blue(correctFileName)}" created with `));
					log(chalk.green(`code from template "${chalk.blue(answers.templateName)}"`));
					log(chalk.green(`on "${chalk.blue(dir)}" folder.`));
					require('child_process').exec(`start "" "${dir}"`);
				});
			})
			.catch(error => {
				console.error(error);
			});
	});

commander.parse(process.argv);