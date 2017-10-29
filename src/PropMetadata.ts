import {ClassInstancePropertyTypes} from "ts-simple-ast";

import TypesHelper from "./TypesHelper";
import SyntaxKind from "./SyntaxKind";
import TypeDefinition from "./TypeDefinition";
import {ImportDefinition} from "./TypeMetadata";


export default class PropMetadata {
    
    constructor(
        public readonly name: string,
        public readonly propType: TypeDefinition,
        public readonly optional: boolean,
        public readonly defaultValue ?: string
    ) {}

    static fromDeclaration(declaration : ClassInstancePropertyTypes, importDefinitions: ImportDefinition[]) : PropMetadata|undefined {
        
        const compilerNode = declaration.compilerNode;

        if(!compilerNode || compilerNode.kind !== SyntaxKind.PropertyDeclaration) {
            return;
        }

        const name = (compilerNode.name as any).escapedText;
        const propType = TypesHelper.getTypeDefinition(compilerNode.type, importDefinitions);
        const optional = !!compilerNode.questionToken;

        let defaultValue = undefined;

        if((compilerNode as any).initializer) {
            const defaultValueMatch = compilerNode.getText().match(/=(.*);/m);
            if(defaultValueMatch) {
                defaultValue = defaultValueMatch[1].trim();
            }
        }

        return new PropMetadata(
            name,
            propType,
            optional,
            defaultValue,
        );
    }
}

