import TypeKind from "./TypeKind";


export class ImportDefinition {

    constructor(
        public readonly fileName: string,
        public readonly className: string,
        public readonly referencedAs: string,
        public readonly defaultExport: boolean = false
    ) {}
}


export class TypeMetadata {

    constructor(
        public readonly kind: TypeKind,
        public readonly text: string,
        public readonly importDefinition ?: ImportDefinition
    ) {}
}


export class FunctionTypeMetadata extends TypeMetadata {

    constructor(
        text: string,
        importDefinition ?: ImportDefinition,
        public readonly generic : boolean = false
    ) {
        super(TypeKind.FUNCTION, text, importDefinition);
    }
}

export const orOperatorTypeMetadata = new TypeMetadata(TypeKind.OR_OPERATOR, '|');
export const andOperatorTypeMetadata = new TypeMetadata(TypeKind.AND_OPERATOR, '&');
export const openParenthesisTypeMetadata = new TypeMetadata(TypeKind.OPEN_PARENTHESIS, '(');
export const closeParenthesisTypeMetadata = new TypeMetadata(TypeKind.CLOSE_PARENTHESIS, ')');
