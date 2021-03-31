import * as Emitter from "@/Emitter"
import * as Parser from "@/Parser"

describe("Emitter", () => {
  describe("emitIdentifier", () => {
    it("emits an identifier", () => {
      const identifier = Parser.createIdentifier("foo")
      const emitted = Emitter.emitIdentifier(identifier)
      expect(emitted).toBe("foo")
    })
  })

  describe("emitLambdaExpression", () => {
    it("emits a lambda expression without generics", () => {
      const generics: Parser.IdentifierAst[] = []
      const parameters = [Parser.createIdentifier("number"), Parser.createIdentifier("number")]
      const result = Parser.createIdentifier("number")
      const lambdaExpression = Parser.createLambdaExpression(generics, parameters, result)
      const emitted = Emitter.emitLambdaExpression(lambdaExpression)
      expect(emitted).toBe("(arg0: number) => (arg1: number) => number")
    })

    it("emits a lambda expression with generics", () => {
      const generics: Parser.IdentifierAst[] = [Parser.createIdentifier("a")]
      const parameters = [Parser.createIdentifier("a"), Parser.createIdentifier("a")]
      const result = Parser.createIdentifier("a")
      const lambdaExpression = Parser.createLambdaExpression(generics, parameters, result)
      const emitted = Emitter.emitLambdaExpression(lambdaExpression)
      expect(emitted).toBe("<a>(arg0: a) => (arg1: a) => a")
    })
  })

  describe("emitValueSignature", () => {
    it("emits a value signature", () => {
      const name = Parser.createIdentifier("count")
      const value = Parser.createIdentifier("number")
      const valueSignature = Parser.createValueSignature(name, value)
      const emitted = Emitter.emitValueSignature(valueSignature)
      expect(emitted).toBe("type Count = number")
    })
  })

  describe("emitFunctionSignature", () => {
    it("emits a function signature without generics", () => {
      const name = Parser.createIdentifier("sum")
      const generics: Parser.IdentifierAst[] = []
      const parameters = [Parser.createIdentifier("number"), Parser.createIdentifier("number")]
      const result = Parser.createIdentifier("number")
      const lambdaExpression = Parser.createLambdaExpression(generics, parameters, result)
      const functionSignature = Parser.createFunctionSignature(name, lambdaExpression)
      const emitted = Emitter.emitFunctionSignature(functionSignature)
      expect(emitted).toBe("type Sum = (arg0: number) => (arg1: number) => number")
    })

    it("emits a function signature with generics", () => {
      const name = Parser.createIdentifier("foo")
      const generics: Parser.IdentifierAst[] = [Parser.createIdentifier("a")]
      const parameters = [Parser.createIdentifier("a"), Parser.createIdentifier("a")]
      const result = Parser.createIdentifier("a")
      const lambdaExpression = Parser.createLambdaExpression(generics, parameters, result)
      const functionSignature = Parser.createFunctionSignature(name, lambdaExpression)
      const emitted = Emitter.emitFunctionSignature(functionSignature)
      expect(emitted).toBe("type Foo = <a>(arg0: a) => (arg1: a) => a")
    })
  })
})
