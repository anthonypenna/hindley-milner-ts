import {
  createFunctionSignature,
  createIdentifier,
  createLambdaExpression,
  createProgram,
  createValueSignature,
  FunctionSignatureAst,
  IdentifierAst,
  LambdaExpressionAst,
  ProgramAst,
  ValueSignatureAst,
} from "../src/AST"

describe("AST", () => {
  describe("createParameter", () => {
    it("returns a parameter ast", () => {
      const ast = createIdentifier("number")
      expect(ast).toEqual<IdentifierAst>({
        text: "number",
        type: "Identifier",
      })
    })
  })

  describe("createLambdaExpression", () => {
    it("returns a lambda expression ast", () => {
      const parameters = [createIdentifier("number"), createIdentifier("number")]
      const result = createIdentifier("number")
      const ast = createLambdaExpression(parameters, result)
      expect(ast).toEqual<LambdaExpressionAst>({
        parameters,
        result,
        type: "LambdaExpression",
      })
    })
  })

  describe("createValueSignature", () => {
    it("returns a value signature ast", () => {
      const name = createIdentifier("count")
      const value = createIdentifier("number")
      const ast = createValueSignature(name, value)
      expect(ast).toEqual<ValueSignatureAst>({
        name,
        type: "ValueSignature",
        value,
      })
    })
  })

  describe("createFunctionSignature", () => {
    it("returns a function signature ast", () => {
      const name = createIdentifier("sum")
      const parameters = [createIdentifier("number"), createIdentifier("number")]
      const result = createIdentifier("number")
      const body = createLambdaExpression(parameters, result)
      const ast = createFunctionSignature(name, body)
      expect(ast).toEqual<FunctionSignatureAst>({
        body,
        name,
        type: "FunctionSignature",
      })
    })
  })

  describe("createProgram", () => {
    it("returns a program ast", () => {
      const valueDeclarationName = createIdentifier("name")
      const valueDeclarationValue = createIdentifier("number")
      const valueDeclaration = createValueSignature(valueDeclarationName, valueDeclarationValue)
      const functionDeclarationName = createIdentifier("sum")
      const functionDeclarationLambdaExpressionParameters = [createIdentifier("number"), createIdentifier("number")]
      const functionDeclarationLambdaExpressionResult = createIdentifier("number")
      const functionDeclarationLambdaExpression = createLambdaExpression(
        functionDeclarationLambdaExpressionParameters,
        functionDeclarationLambdaExpressionResult
      )
      const functionDeclaration = createFunctionSignature(functionDeclarationName, functionDeclarationLambdaExpression)
      const body = [valueDeclaration, functionDeclaration]
      const ast = createProgram(body)
      expect(ast).toEqual<ProgramAst>({
        body,
        type: "Program",
      })
    })
  })
})
