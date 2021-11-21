const parse = require("@babel/parser").parse;
const generate = require("@babel/generator").default;

let code = `
import fn from './a/b';
import { Select,  Pagination } from '@babel/parse';
import { a } from '@/babel/parse';
import { x } from '/babel/parse';
export default {

    data() {
    return {
        a: 1
    }
    }
}
`;

function sortJSImport(code) {
    // parse 解析
    const ast = parse(code, { sourceType: "module" });
    // 所有import节点
    const importDeclarationList = ast.program.body.filter(item => item.type === 'ImportDeclaration');
    const firstList = importDeclarationList.filter(item => /^@[a-zA-Z]/.test(item.source.value))
    const secondList = importDeclarationList.filter(item => /^@\//.test(item.source.value))
    const thirdLit = importDeclarationList.filter(item => /^\//.test(item.source.value))
    const lastList = importDeclarationList.filter(item => /^\./.test(item.source.value))

    const rightList = [...firstList, ... secondList, ... thirdLit, ...lastList];
    ast.program.body = ast.program.body.filter(item => item.type !== 'ImportDeclaration');
    ast.program.body = [...rightList, ...ast.program.body];
    let newCode = generate(ast).code;
    return newCode
}

module.exports.sortJSImport = sortJSImport
// ImportDeclaration



