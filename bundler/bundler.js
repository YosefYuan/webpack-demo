const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({
            node
        }) {
            const dirname = path.dirname(filename);
            const newFile = './' + path.join(dirname, node.source.value);
            dependencies[node.source.value] = newFile;
        }
    })
    const {
        code
    } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })
    console.log(code);
    return {
        filename,
        dependencies,
        code
    }
}

const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);
    const graphArr = [ entryModule ];
    for(let i = 0; i < graphArr.length; i++) {
        const item = graphArr[i];
        const { dependencies } = item;
        if(dependencies){
            for(let j in dependencies) {
                graphArr.push(moduleAnalyser(dependencies[j]))
            };
        }
    }
    const graph = {};
    graphArr.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    })
    return graph;
}

const graphInfo = makeDependenciesGraph('./src/index.js');
console.log(graphInfo);