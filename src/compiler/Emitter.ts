import { FunctionSignatureAst, IdentifierAst, LambdaExpressionAst, ValueSignatureAst } from "@/compiler/AST"

export function emitIdentifier(identifier: IdentifierAst): string {
  return identifier.text
}

export function emitLambdaExpression(lambdaExpression: LambdaExpressionAst): string {
  const generics = lambdaExpression.generics.map(emitIdentifier).join(", ")
  const parameters = lambdaExpression.parameters
    .reduce((result, parameter, index) => `${result} (arg${index}: ${emitIdentifier(parameter)}) =>`, "")
    .trim()
  const result = emitIdentifier(lambdaExpression.result)
  return lambdaExpression.generics.length ? `<${generics}>${parameters} ${result}` : `${parameters} ${result}`
}

export function emitValueSignature(valueSignature: ValueSignatureAst): string {
  const name = emitIdentifier(valueSignature.name)
  const value = emitIdentifier(valueSignature.value)
  const capitalizedName = name.slice(0, 1).toUpperCase() + name.slice(1)
  return `type ${capitalizedName} = ${value}`
}

export function emitFunctionSignature(functionSignature: FunctionSignatureAst): string {
  const name = emitIdentifier(functionSignature.name)
  const body = emitLambdaExpression(functionSignature.body)
  const capitalizedName = name.slice(0, 1).toUpperCase() + name.slice(1)
  return `type ${capitalizedName} = ${body}`
}
