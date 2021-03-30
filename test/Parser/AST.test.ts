import * as AST from "../../src/Parser/AST"

describe("AST", () => {
  describe("createIdentifier", () => {
    it("returns an identifier ast", () => {
      const ast = AST.createIdentifier("number")
      expect(ast).toEqual<AST.IdentifierAst>({
        text: "number",
        type: "Identifier",
      })
    })
  })

  describe("createLambdaExpression", () => {
    it("returns a lambda expression ast", () => {
      const parameters = [AST.createIdentifier("number"), AST.createIdentifier("number")]
      const result = AST.createIdentifier("number")
      const ast = AST.createLambdaExpression(parameters, result)
      expect(ast).toEqual<AST.LambdaExpressionAst>({
        parameters,
        result,
        type: "LambdaExpression",
      })
    })
  })

  describe("createValueSignature", () => {
    it("returns a value signature ast", () => {
      const name = AST.createIdentifier("count")
      const value = AST.createIdentifier("number")
      const ast = AST.createValueSignature(name, value)
      expect(ast).toEqual<AST.ValueSignatureAst>({
        name,
        type: "ValueSignature",
        value,
      })
    })
  })

  describe("createFunctionSignature", () => {
    it("returns a function signature ast", () => {
      const name = AST.createIdentifier("sum")
      const parameters = [AST.createIdentifier("number"), AST.createIdentifier("number")]
      const result = AST.createIdentifier("number")
      const body = AST.createLambdaExpression(parameters, result)
      const ast = AST.createFunctionSignature(name, body)
      expect(ast).toEqual<AST.FunctionSignatureAst>({
        body,
        name,
        type: "FunctionSignature",
      })
    })
  })
})
