export type AstNode<A extends string> = {
  readonly type: A
}

export type IdentifierAst = AstNode<"Identifier"> & {
  readonly text: string
}

export type LambdaExpressionAst = AstNode<"LambdaExpression"> & {
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

export type TypeDeclarationAst = ValueSignatureAst | FunctionSignatureAst

export type ProgramAst = AstNode<"Program"> & {
  readonly body: TypeDeclarationAst[]
}

export function createIdentifier(text: string): IdentifierAst {
  return {
    text,
    type: "Identifier",
  }
}

export function createLambdaExpression(parameters: IdentifierAst[], result: IdentifierAst): LambdaExpressionAst {
  return {
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

export function createProgram(body: TypeDeclarationAst[]): ProgramAst {
  return {
    body,
    type: "Program",
  }
}
