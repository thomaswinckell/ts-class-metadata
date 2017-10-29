import Ast from "ts-simple-ast";
import * as path from "path";

import ClassMetadata from "./ClassMetadata";
import {ImportDefinition} from "./TypeMetadata";
import SyntaxKind from "./SyntaxKind";


namespace Explorer {

    let importDefinitions: { [fileName:string]: ImportDefinition[] } = {};

    function getParentWithProperty(obj: any, property: string, currentRecursionLevel = 0, maxRecursionLevel = 10): any {

        if(!obj) {
            return;
        }

        currentRecursionLevel++;

        if(currentRecursionLevel > maxRecursionLevel) {
            return;
        }

        if(obj[property]) {
            return obj;
        }

        return getParentWithProperty(obj.parent, property, currentRecursionLevel, maxRecursionLevel);
    }

    function importsDefinitionsFromStatement(statement: any) : ImportDefinition[] {

        const importClause = statement.importClause;

        if(!importClause) {
            return [];
        }

        const parent = getParentWithProperty(statement, 'moduleSpecifier');

        if(!parent) {
            return [];
        }

        const fileName = parent.moduleSpecifier.text;

        if(importClause.kind === SyntaxKind.ImportClause) {

            // default export
            if(importClause.name && importClause.name.escapedText) {
                const name = importClause.name.escapedText;
                return [new ImportDefinition(fileName, name, name, true)];
            }

            if(importClause.namedBindings && importClause.namedBindings.elements) {

                return importClause.namedBindings.elements.map((e: any) => {

                    if(e.kind === SyntaxKind.ImportSpecifier) {
                        if(e.name && e.name.escapedText) {
                            const referencedAs = e.name.escapedText;

                            if(e.propertyName && e.propertyName.escapedText) {
                                const className = e.propertyName.escapedText;
                                return new ImportDefinition(fileName, className, referencedAs);
                            } else {
                                return new ImportDefinition(fileName, referencedAs, referencedAs);
                            }
                        }
                    }
                    return;
                }).filter((n: any) => n !== undefined);
            }
        }

        console.log('new kind of import clause : ' + importClause.kind);

        return [];
    }

    function registerImportDefinition(statement: any, fileName: string) {

        importsDefinitionsFromStatement(statement).forEach(id => {

            if(Array.isArray(importDefinitions[fileName])) {
                importDefinitions[fileName].push(id);
            } else {
                importDefinitions[fileName] = [id];
            }
        })
    }

    export function scan(...sourceFiles: string[]) : ClassMetadata[] {

        const ast = new Ast();

        ast.addSourceFiles(...sourceFiles);

        let classMetada : ClassMetadata[] = [];

        ast.getSourceFiles().forEach(sf => {

            const compilerNode = (sf as any)._compilerNode;

            // ignore declaration files
            if(compilerNode.isDeclarationFile) {
                return;
            }

            const fileName = path.relative(process.cwd(), sf.compilerNode.fileName);

            compilerNode.statements.forEach((s: any) => {
                registerImportDefinition(s, fileName);
            });

            sf.getClasses().forEach(cl => {
                classMetada.push(ClassMetadata.fromDeclaration(cl, fileName, importDefinitions[fileName] || []));
            });
        });

        return classMetada;
    }
}

export default Explorer