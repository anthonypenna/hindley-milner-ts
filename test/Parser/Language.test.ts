import * as AST from "../../src/Parser/AST"
import * as Parser from "../../src/Parser/Language"

const INVALID_IDENTIFIER_INPUTS = ["", "123", "!@#"]

const INVALID_LAMBDA_EXPRESSION_INPUTS = INVALID_IDENTIFIER_INPUTS.concat(
  "number ->",
  "123 ->",
  "!@# ->",
  "number -> 123",
  "number -> !@#",
  "123 -> number",
  "123 -> 123",
  "123 -> !@#",
  "!@# -> number",
  "!@# -> 123",
  "!@# -> !@#",
  "number ->",
  "123 ->",
  "!@# ->",
  "number -> 123",
  "number -> !@#",
  "123 -> number",
  "123 -> 123",
  "123 -> !@#",
  "!@# -> number",
  "!@# -> 123",
  "!@# -> !@#",
  "forall a a -> a",
  "forall a 123. -> 1 -> 123",
  "forall a !@#. -> 1 -> !@#",
  "forall 123 b. -> 123 -> b",
  "forall 123 123. -> 123 -> 123",
  "forall 123 !@#. -> 123 -> !@#",
  "forall !@# b. -> !@# -> b",
  "forall !@# 123. -> !@# -> 123",
  "forall !@# !@#. -> !@# -> !@#"
)

const INVALID_VALUE_SIGNATURE_INPUTS = INVALID_IDENTIFIER_INPUTS.concat(
  "count",
  "count :: 123",
  "count :: !@#",
  "123 :: count",
  "!@# :: count"
)

const INVALID_FUNCTION_SIGNATURE_INPUTS = INVALID_IDENTIFIER_INPUTS.concat(
  "sum",
  "sum :: number",
  "sum :: 123",
  "sum :: !@#",
  "123 :: number",
  "123 :: 123",
  "123 :: !@#",
  "!@# :: number",
  "!@# :: 123",
  "!@# :: !@#",
  "sum :: number -> 123",
  "sum :: number -> !@#",
  "sum :: 123 -> number",
  "sum :: 123 -> 123",
  "sum :: 123 -> !@#",
  "sum :: !@# -> number",
  "sum :: !@# -> 123",
  "sum :: !@# -> !@#"
)

describe("Parser", () => {
  describe("Identifier", () => {
    it("throws an error on parse fail", () => {
      INVALID_IDENTIFIER_INPUTS.map(input => () => Parser.language.identifier.tryParse(input)).forEach(io =>
        expect(io).toThrow()
      )
    })

    it("returns an identifier ast on parse success", () => {
      const node = Parser.language.identifier.tryParse("number")
      const identifier = AST.createIdentifier("number")
      expect(node).toEqual<AST.IdentifierAst>(identifier)
    })
  })

  describe("LambdaExpression", () => {
    it("throws an error on parse fail", () => {
      INVALID_LAMBDA_EXPRESSION_INPUTS.map(input => () =>
        Parser.language.lambdaExpression.tryParse(input)
      ).forEach(io => expect(io).toThrow())
    })

    it("returns a lambda expression ast on parse success", () => {
      const node = Parser.language.lambdaExpression.tryParse("forall a b. a -> b")
      const generics = [AST.createIdentifier("a"), AST.createIdentifier("b")]
      const parameters = [AST.createIdentifier("a")]
      const result = AST.createIdentifier("b")
      const lambdaExpression = AST.createLambdaExpression(generics, parameters, result)
      expect(node).toEqual<AST.LambdaExpressionAst>(lambdaExpression)
    })
  })

  describe("ValueSignature", () => {
    it("throws an error on parse fail", () => {
      INVALID_VALUE_SIGNATURE_INPUTS.map(input => () => Parser.language.valueSignature.tryParse(input)).forEach(io =>
        expect(io).toThrow()
      )
    })

    it("returns a value signature ast on parse success", () => {
      const node = Parser.language.valueSignature.tryParse("count :: number")
      const name = AST.createIdentifier("count")
      const value = AST.createIdentifier("number")
      expect(node).toEqual<AST.ValueSignatureAst>(AST.createValueSignature(name, value))
    })
  })

  describe("FunctionSignature", () => {
    it("throws an error on parse fail", () => {
      INVALID_FUNCTION_SIGNATURE_INPUTS.map(input => () =>
        Parser.language.functionSignature.tryParse(input)
      ).forEach(io => expect(io).toThrow())
    })

    it("returns a function signature ast on parse success", () => {
      const node = Parser.language.functionSignature.tryParse("sum :: number -> number -> number")
      const name = AST.createIdentifier("sum")
      const parameters = [AST.createIdentifier("number"), AST.createIdentifier("number")]
      const result = AST.createIdentifier("number")
      const body = AST.createLambdaExpression([], parameters, result)
      expect(node).toEqual<AST.FunctionSignatureAst>(AST.createFunctionSignature(name, body))
    })
  })
})
