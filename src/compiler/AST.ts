export type AstNode<A extends string> = {
  readonly type: A
}

export type IdentifierAst = AstNode<"Identifier"> & {
  readonly text: string
}

export type LambdaExpressionAst = AstNode<"LambdaExpression"> & {
  readonly generics: IdentifierAst[]
  readonly parameters: IdentifierAst[]
  readonly result: IdentifierAst
}

export type ValueSignatureAst = AstNode<"ValueSignature"> & {
  readonly name: IdentifierAst
  readonly value: IdentifierAst
}

export type FunctionSignatureAst = AstNode<"FunctionSignature"> & {
  readonly name: IdentifierAst
  readonly body: LambdaExpressionAst
}

export type TypeDeclarationAst = FunctionSignatureAst | ValueSignatureAst

export type TypeDeclarationMap<F, V> = { Function: (fs: FunctionSignatureAst) => F; Value: (vs: ValueSignatureAst) => V }

export function createIdentifier(text: string): IdentifierAst {
  return {
    text,
    type: "Identifier",
  }
}

export function createLambdaExpression(generics: IdentifierAst[], parameters: IdentifierAst[], result: IdentifierAst): LambdaExpressionAst {
  return {
    generics,
    parameters,
    result,
    type: "LambdaExpression",
  }
}

export function createValueSignature(name: IdentifierAst, value: IdentifierAst): ValueSignatureAst {
  return {
    name,
    type: "ValueSignature",
    value,
  }
}

export function createFunctionSignature(name: IdentifierAst, body: LambdaExpressionAst): FunctionSignatureAst {
  return {
    body,
    name,
    type: "FunctionSignature",
  }
}

export function foldTypeDeclaration<F, V>(caseof: TypeDeclarationMap<F, V>): (typeDeclaration: TypeDeclarationAst) => F | V {
  return typeDeclaration => {
    switch (typeDeclaration.type) {
      case "FunctionSignature":
        return caseof.Function(typeDeclaration)
      case "ValueSignature":
        return caseof.Value(typeDeclaration)
    }
  }
}
