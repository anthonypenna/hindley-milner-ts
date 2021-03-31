import * as AST from "@/Parser/AST"

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
      const generics = [AST.createIdentifier("a")]
      const parameters = [AST.createIdentifier("a"), AST.createIdentifier("a")]
      const result = AST.createIdentifier("a")
      const ast = AST.createLambdaExpression(generics, parameters, result)
      expect(ast).toEqual<AST.LambdaExpressionAst>({
        generics,
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
      const name = AST.createIdentifier("concat")
      const generics = [AST.createIdentifier("a")]
      const parameters = [AST.createIdentifier("a"), AST.createIdentifier("a")]
      const result = AST.createIdentifier("a")
      const body = AST.createLambdaExpression(generics, parameters, result)
      const ast = AST.createFunctionSignature(name, body)
      expect(ast).toEqual<AST.FunctionSignatureAst>({
        body,
        name,
        type: "FunctionSignature",
      })
    })
  })
})
