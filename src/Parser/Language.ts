import * as P from "parsimmon"
import * as AST from "./AST"

export type Language = {
  readonly identifier: AST.IdentifierAst
  readonly lambdaExpression: AST.LambdaExpressionAst
  readonly valueSignature: AST.ValueSignatureAst
  readonly functionSignature: AST.FunctionSignatureAst
}

export const language = P.createLanguage<Language>({
  identifier: () =>
    P.regex(/[a-zA-Z]+/)
      .map(AST.createIdentifier)
      .trim(P.optWhitespace)
      .desc("identifier"),

  lambdaExpression: r =>
    P.alt(
      P.string("forall").chain(() =>
        r.identifier
          .atLeast(1)
          .skip(P.string("."))
          .chain(generics =>
            r.identifier.skip(P.string("->")).chain(head => {
              return r.identifier.sepBy1(P.string("->")).map(tail => {
                const results = [head].concat(tail)
                const lastIndex = results.length - 1
                const parameters = results.slice(0, lastIndex)
                const result = results[lastIndex]
                return AST.createLambdaExpression(generics, parameters, result)
              })
            })
          )
      ),
      r.identifier.skip(P.string("->")).chain(head => {
        return r.identifier.sepBy1(P.string("->")).map(tail => {
          const generics: AST.IdentifierAst[] = []
          const results = [head].concat(tail)
          const lastIndex = results.length - 1
          const parameters = results.slice(0, lastIndex)
          const result = results[lastIndex]
          return AST.createLambdaExpression(generics, parameters, result)
        })
      })
    ),

  valueSignature: r =>
    r.identifier
      .skip(P.string("::"))
      .chain(name => {
        return r.identifier.map(value => {
          return AST.createValueSignature(name, value)
        })
      })
      .trim(P.alt(P.optWhitespace, P.newline)),

  functionSignature: r =>
    r.identifier
      .skip(P.string("::").trim(P.optWhitespace))
      .chain(name => {
        return r.lambdaExpression.map(body => {
          return AST.createFunctionSignature(name, body)
        })
      })
      .trim(P.alt(P.optWhitespace, P.newline)),
})
