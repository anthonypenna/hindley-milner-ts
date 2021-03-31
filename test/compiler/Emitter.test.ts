import {
  IdentifierAst,
  createFunctionSignature,
  createIdentifier,
  createLambdaExpression,
  createValueSignature,
} from "@/compiler/AST"

import { emitFunctionSignature, emitIdentifier, emitLambdaExpression, emitValueSignature } from "@/compiler/Emitter"

describe("Emitter", () => {
  describe("emitIdentifier", () => {
    it("emits an identifier", () => {
      const identifier = createIdentifier("foo")
      const emitted = emitIdentifier(identifier)
      expect(emitted).toBe("foo")
    })
  })

  describe("emitLambdaExpression", () => {
    it("emits a lambda expression without generics", () => {
      const generics: IdentifierAst[] = []
      const parameters = [createIdentifier("number"), createIdentifier("number")]
      const result = createIdentifier("number")
      const lambdaExpression = createLambdaExpression(generics, parameters, result)
      const emitted = emitLambdaExpression(lambdaExpression)
      expect(emitted).toBe("(arg0: number) => (arg1: number) => number")
    })

    it("emits a lambda expression with generics", () => {
      const generics: IdentifierAst[] = [createIdentifier("a")]
      const parameters = [createIdentifier("a"), createIdentifier("a")]
      const result = createIdentifier("a")
      const lambdaExpression = createLambdaExpression(generics, parameters, result)
      const emitted = emitLambdaExpression(lambdaExpression)
      expect(emitted).toBe("<a>(arg0: a) => (arg1: a) => a")
    })
  })

  describe("emitValueSignature", () => {
    it("emits a value signature", () => {
      const name = createIdentifier("count")
      const value = createIdentifier("number")
      const valueSignature = createValueSignature(name, value)
      const emitted = emitValueSignature(valueSignature)
      expect(emitted).toBe("type Count = number")
    })
  })

  describe("emitFunctionSignature", () => {
    it("emits a function signature without generics", () => {
      const name = createIdentifier("sum")
      const generics: IdentifierAst[] = []
      const parameters = [createIdentifier("number"), createIdentifier("number")]
      const result = createIdentifier("number")
      const lambdaExpression = createLambdaExpression(generics, parameters, result)
      const functionSignature = createFunctionSignature(name, lambdaExpression)
      const emitted = emitFunctionSignature(functionSignature)
      expect(emitted).toBe("type Sum = (arg0: number) => (arg1: number) => number")
    })

    it("emits a function signature with generics", () => {
      const name = createIdentifier("foo")
      const generics: IdentifierAst[] = [createIdentifier("a")]
      const parameters = [createIdentifier("a"), createIdentifier("a")]
      const result = createIdentifier("a")
      const lambdaExpression = createLambdaExpression(generics, parameters, result)
      const functionSignature = createFunctionSignature(name, lambdaExpression)
      const emitted = emitFunctionSignature(functionSignature)
      expect(emitted).toBe("type Foo = <a>(arg0: a) => (arg1: a) => a")
    })
  })
})
