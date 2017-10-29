import PropMetadata from "./PropMetadata";
import {ClassDeclaration} from "ts-simple-ast";
import TypesHelper from "./TypesHelper";
import TypeDefinition from "./TypeDefinition";
import {ImportDefinition} from "./TypeMetadata";


export default class ClassMetadata {

    constructor(
        public readonly fileName: string,
        public readonly classType: TypeDefinition,
        public readonly propsMetadata: PropMetadata[]
    ) {}

    static fromDeclaration(declaration: ClassDeclaration, fileName: string, importDefinitions: ImportDefinition[]) : ClassMetadata {

        const classType = TypesHelper.getTypeDefinition((declaration as any)._compilerNode, importDefinitions);

        const propsMetadata = declaration.getInstanceProperties().map(d => PropMetadata.fromDeclaration(d, importDefinitions)).filter(mbPm => mbPm !== undefined) as PropMetadata[];

        return new ClassMetadata(fileName, classType, propsMetadata)
    }
}