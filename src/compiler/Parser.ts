import { alt, createLanguage, newline, optWhitespace, regex, string } from "parsimmon"

import {
  FunctionSignatureAst,
  IdentifierAst,
  LambdaExpressionAst,
  TypeDeclarationAst,
  ValueSignatureAst,
  createFunctionSignature,
  createIdentifier,
  createLambdaExpression,
  createValueSignature,
} from "./AST"

export type Parser = {
  readonly identifier: IdentifierAst
  readonly lambdaExpression: LambdaExpressionAst
  readonly valueSignature: ValueSignatureAst
  readonly functionSignature: FunctionSignatureAst
  readonly signature: TypeDeclarationAst
}

export const parser = createLanguage<Parser>({
  identifier: () =>
    regex(/[a-zA-Z]+/)
      .map(createIdentifier)
      .trim(optWhitespace)
      .desc("identifier"),

  lambdaExpression: r =>
    alt(
      string("forall").chain(() =>
        r.identifier
          .atLeast(1)
          .skip(string("."))
          .chain(generics =>
            r.identifier.skip(string("->")).chain(head => {
              return r.identifier.sepBy1(string("->")).map(tail => {
                const results = [head].concat(tail)
                const lastIndex = results.length - 1
                const parameters = results.slice(0, lastIndex)
                const result = results[lastIndex]
                return createLambdaExpression(generics, parameters, result)
              })
            })
          )
      ),
      r.identifier.skip(string("->")).chain(head => {
        return r.identifier.sepBy1(string("->")).map(tail => {
          const generics: IdentifierAst[] = []
          const results = [head].concat(tail)
          const lastIndex = results.length - 1
          const parameters = results.slice(0, lastIndex)
          const result = results[lastIndex]
          return createLambdaExpression(generics, parameters, result)
        })
      })
    ),

  valueSignature: r =>
    r.identifier
      .skip(string("::"))
      .chain(name => {
        return r.identifier.map(value => {
          return createValueSignature(name, value)
        })
      })
      .trim(alt(optWhitespace, newline)),

  functionSignature: r =>
    r.identifier
      .skip(string("::").trim(optWhitespace))
      .chain(name => {
        return r.lambdaExpression.map(body => {
          return createFunctionSignature(name, body)
        })
      })
      .trim(alt(optWhitespace, newline)),

  signature: r => alt(r.functionSignature, r.valueSignature),
})
