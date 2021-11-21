#!/usr/bin/env node
const commander = require('commander'); // (normal include)
const chalk = require("chalk");
// const ora = require('ora');
const fs = require("fs-extra");
const fs2 = require("fs")
const program = new commander.Command();
const package = require('../package.json');

// const spinner = ora('sorting import...')

program
    .version(package.version)
    .command('sort <source> [destination]')
    .description('sort import')
    .action((source, destination) => {
        overWriteSortImport(source)
        console.log(chalk.green('sort complete~'))
    });

const { sortJSImport } = require("../parserJs.js")

function overWriteSortImport(file) {
    fs2.readFile(file, 'utf8', ((err, initCode) => {
        const isVueFile = file.endsWith('.vue')
        const isJSFile = file.endsWith('.js')
        const isOtherFile = !isVueFile && !isJSFile
        let needFormatCode
        let newCode = initCode
        // 是否存在script标签
        const rule = /(?<=<script\b[^>]*>)[\s\S]*(?=<\/script>)/
        // 其他文件抛异常
        if(isOtherFile) {
            throw new ReferenceError(`only support vue file and js file,not support other file`);
        }

        if(isVueFile && rule.test(initCode)) {
            console.log('vueFIle')
            // 需要处理
            needFormatCode = initCode.match(rule)[0]
            const afterFormatCode = sortJSImport(needFormatCode)
            newCode = initCode.replace(rule, afterFormatCode)
            console.log('newVue--->', newCode)
        }

        if(isJSFile) {
            const afterFormatCode = sortJSImport(initCode)
            newCode = afterFormatCode
        }

        // outputFile会覆盖掉原有内容
        fs.outputFile(file, newCode, err => {
            console.log(err) // => null
        })
    }))
}

program.parse(process.argv);



// const spinner = ora('sorting import...')
// spinner.start();


//
// spinner.succeed('sort success')