#!/usr/bin/env node
const commander = require('commander');
const chalk = require("chalk");
const fs = require("fs-extra");
const fs2 = require("fs")
const package = require('../package.json');
const parse = require("@babel/parser").parse;
const generate = require("@babel/generator").default;
const program = new commander.Command();


program
    .version(package.version)
    .command('sort <source>')
    .description('sort import')
    .action((source) => {
        overWriteSortImport(source)
        console.log(chalk.green('sort complete~🚀'))
    });


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
            // 需要处理
            needFormatCode = initCode.match(rule)[0]
            const afterFormatCode = sortJSImport(needFormatCode)
            newCode = initCode.replace(rule, afterFormatCode)
        }

        if(isJSFile) {
            const afterFormatCode = sortJSImport(initCode)
            newCode = afterFormatCode
        }

        // outputFile会覆盖掉原有内容
        fs.outputFile(file, newCode, err => {
            if(err) {
                throw new ReferenceError(err);
            }
        })
    }))
}

function sortJSImport(code) {
    // parse 解析
    const ast = parse(code, { sourceType: "module" });
    // 所有import节点
    const importDeclarationList = ast.program.body.filter(item => item.type === 'ImportDeclaration');
    const firstList = importDeclarationList.filter(item => /^[a-zA-Z]/.test(item.source.value))
    const secondList = importDeclarationList.filter(item => /^@[a-zA-Z]/.test(item.source.value))
    const thirdLit = importDeclarationList.filter(item => /^@\//.test(item.source.value))
    const fourthList = importDeclarationList.filter(item => /^\//.test(item.source.value))
    const lastList = importDeclarationList.filter(item => /^\./.test(item.source.value))

    const rightList = Array.from(new Set([...firstList, ... secondList, ... thirdLit, ...fourthList, ...lastList, ...importDeclarationList]));
    ast.program.body = ast.program.body.filter(item => item.type !== 'ImportDeclaration');
    ast.program.body = [...rightList, ...ast.program.body];
    let newCode = generate(ast).code;
    return newCode
}

program.parse(process.argv)
