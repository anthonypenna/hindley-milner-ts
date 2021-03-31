import * as Parser from "@/Parser"

export function emitIdentifier(identifier: Parser.IdentifierAst): string {
  return identifier.text
}

export function emitLambdaExpression(lambdaExpression: Parser.LambdaExpressionAst): string {
  const generics = lambdaExpression.generics.map(emitIdentifier).join(", ")
  const parameters = lambdaExpression.parameters
    .reduce((result, parameter, index) => `${result} (arg${index}: ${emitIdentifier(parameter)}) =>`, "")
    .trim()
  const result = emitIdentifier(lambdaExpression.result)
  return lambdaExpression.generics.length ? `<${generics}>${parameters} ${result}` : `${parameters} ${result}`
}

export function emitValueSignature(valueSignature: Parser.ValueSignatureAst): string {
  const name = emitIdentifier(valueSignature.name)
  const value = emitIdentifier(valueSignature.value)
  const capitalizedName = name.slice(0, 1).toUpperCase() + name.slice(1)
  return `type ${capitalizedName} = ${value}`
}

export function emitFunctionSignature(functionSignature: Parser.FunctionSignatureAst): string {
  const name = emitIdentifier(functionSignature.name)
  const body = emitLambdaExpression(functionSignature.body)
  const capitalizedName = name.slice(0, 1).toUpperCase() + name.slice(1)
  return `type ${capitalizedName} = ${body}`
}
