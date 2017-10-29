import SyntaxKind from "./SyntaxKind";
import TypeDefinition from "./TypeDefinition";
import {FunctionTypeMetadata, ImportDefinition} from "./TypeMetadata";



namespace TypesHelper {


    export function getTypeDefinition(type: any, importDefinitions: ImportDefinition[]): TypeDefinition {

        if (!type.kind) {
            return [];
        }

        function importDefinitionByClassName(className: string) {
            return importDefinitions.find(id => id.referencedAs === className);
        }

        switch (type.kind) {

            case SyntaxKind.NumberKeyword:
                return [new FunctionTypeMetadata('Number')];

            case SyntaxKind.ObjectKeyword:
                return [new FunctionTypeMetadata('Object')];

            case SyntaxKind.StringKeyword:
                return [new FunctionTypeMetadata('String')];

            case SyntaxKind.ArrayType:
                return [new FunctionTypeMetadata('Array'), ...getTypeDefinition(type.elementType, importDefinitions)] as TypeDefinition;

            case SyntaxKind.TypeReference: {
                const className = type.typeName.escapedText;
                const id = importDefinitionByClassName(className);
                return [new FunctionTypeMetadata(className, id, !id)];
            }

            case SyntaxKind.TypeParameter: {
                const className = type.name.escapedText;
                const id = importDefinitionByClassName(className);
                return [new FunctionTypeMetadata(className, id, !id)];
            }

            case SyntaxKind.ClassDeclaration: {
                let typeParameters = [];

                if (type.typeParameters) {
                    typeParameters = type.typeParameters.map((tp: any) => getTypeDefinition(tp, importDefinitions));
                }

                const className = type.name.escapedText;

                return [new FunctionTypeMetadata(className, importDefinitionByClassName(className)), ...typeParameters];
            }
        }

        console.log('new kind : ' + type.kind);

        return [];
    }
}

export default TypesHelper;