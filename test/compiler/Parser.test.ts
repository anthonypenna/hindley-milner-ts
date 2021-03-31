import {
  FunctionSignatureAst,
  IdentifierAst,
  LambdaExpressionAst,
  ValueSignatureAst,
  createFunctionSignature,
  createIdentifier,
  createLambdaExpression,
  createValueSignature,
} from "@/compiler/AST"

import { parser } from "@/compiler/Parser"

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

const INVALID_VALUE_SIGNATURE_INPUTS = INVALID_IDENTIFIER_INPUTS.concat("count", "count :: 123", "count :: !@#", "123 :: count", "!@# :: count")

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

const INVALID_SIGNATURE_INPUTS = Array.from(new Set(...INVALID_FUNCTION_SIGNATURE_INPUTS, ...INVALID_VALUE_SIGNATURE_INPUTS))

describe("Parser", () => {
  describe("Language", () => {
    describe("Identifier", () => {
      it("throws an error on parse fail", () => {
        INVALID_IDENTIFIER_INPUTS.map(input => () => parser.identifier.tryParse(input)).forEach(io => expect(io).toThrow())
      })

      it("returns an identifier ast on parse success", () => {
        const node = parser.identifier.tryParse("number")
        const identifier = createIdentifier("number")
        expect(node).toEqual<IdentifierAst>(identifier)
      })
    })

    describe("LambdaExpression", () => {
      it("throws an error on parse fail", () => {
        INVALID_LAMBDA_EXPRESSION_INPUTS.map(input => () => parser.lambdaExpression.tryParse(input)).forEach(io => expect(io).toThrow())
      })

      it("returns a lambda expression ast on parse success", () => {
        const node = parser.lambdaExpression.tryParse("forall a b. a -> b")
        const generics = [createIdentifier("a"), createIdentifier("b")]
        const parameters = [createIdentifier("a")]
        const result = createIdentifier("b")
        const lambdaExpression = createLambdaExpression(generics, parameters, result)
        expect(node).toEqual<LambdaExpressionAst>(lambdaExpression)
      })
    })

    describe("ValueSignature", () => {
      it("throws an error on parse fail", () => {
        INVALID_VALUE_SIGNATURE_INPUTS.map(input => () => parser.valueSignature.tryParse(input)).forEach(io => expect(io).toThrow())
      })

      it("returns a value signature ast on parse success", () => {
        const node = parser.valueSignature.tryParse("count :: number")
        const name = createIdentifier("count")
        const value = createIdentifier("number")
        expect(node).toEqual<ValueSignatureAst>(createValueSignature(name, value))
      })
    })

    describe("FunctionSignature", () => {
      it("throws an error on parse fail", () => {
        INVALID_FUNCTION_SIGNATURE_INPUTS.map(input => () => parser.functionSignature.tryParse(input)).forEach(io => expect(io).toThrow())
      })

      it("returns a function signature ast on parse success", () => {
        const node = parser.functionSignature.tryParse("sum :: number -> number -> number")
        const name = createIdentifier("sum")
        const parameters = [createIdentifier("number"), createIdentifier("number")]
        const result = createIdentifier("number")
        const body = createLambdaExpression([], parameters, result)
        expect(node).toEqual<FunctionSignatureAst>(createFunctionSignature(name, body))
      })
    })

    describe("Signature", () => {
      it("throws an error on parse fail", () => {
        INVALID_SIGNATURE_INPUTS.map(input => () => parser.signature.tryParse(input)).forEach(io => expect(io).toThrow())
      })

      it("returns a value signature ast on parse success", () => {
        const node = parser.signature.tryParse("count :: number")
        const name = createIdentifier("count")
        const value = createIdentifier("number")
        expect(node).toEqual<ValueSignatureAst>(createValueSignature(name, value))
      })

      it("returns a function signature ast on parse success", () => {
        const node = parser.signature.tryParse("sum :: number -> number -> number")
        const name = createIdentifier("sum")
        const parameters = [createIdentifier("number"), createIdentifier("number")]
        const result = createIdentifier("number")
        const body = createLambdaExpression([], parameters, result)
        expect(node).toEqual<FunctionSignatureAst>(createFunctionSignature(name, body))
      })
    })
  })
})
