import * as path from "path";
import * as fs from "fs";
import test from "ava"
import Explorer from "../src/Explorer";


(async function() {

    try {

        let classesByFilename = {};

        const classes = Explorer.scan("./test/models/*.ts");

        if(classes.length !== 0) {
            classesByFilename = classes.reduce((acc, curr) => { acc[curr.fileName] = curr; return acc; }, {});
        }

        function stringify(json: any) {
            return JSON.stringify(json, null, 2);
        }

        Object.keys(classesByFilename).forEach(fileName => {

            const fileBaseName = path.basename(fileName);
            const fileClasses = classesByFilename[fileName];


            const fileContent = JSON.parse(fs.readFileSync(fileName.replace(/\.ts/g, '.meta.json'), 'utf8'));

            test(fileBaseName, t => t.deepEqual(stringify(fileClasses), stringify(fileContent)));
        })

    } catch(e) {
        console.error(e)
    }
})();