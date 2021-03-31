import {
  FunctionSignatureAst,
  IdentifierAst,
  LambdaExpressionAst,
  ValueSignatureAst,
  createFunctionSignature,
  createIdentifier,
  createLambdaExpression,
  createValueSignature,
  foldTypeDeclaration,
  TypeDeclarationAst,
} from "@/compiler/AST"

describe("Parser", () => {
  describe("AST", () => {
    describe("createIdentifier", () => {
      it("returns an identifier ast", () => {
        const ast = createIdentifier("number")
        expect(ast).toEqual<IdentifierAst>({
          text: "number",
          type: "Identifier",
        })
      })
    })

    describe("createLambdaExpression", () => {
      it("returns a lambda expression ast", () => {
        const generics = [createIdentifier("a")]
        const parameters = [createIdentifier("a"), createIdentifier("a")]
        const result = createIdentifier("a")
        const ast = createLambdaExpression(generics, parameters, result)
        expect(ast).toEqual<LambdaExpressionAst>({
          generics,
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
        const name = createIdentifier("concat")
        const generics = [createIdentifier("a")]
        const parameters = [createIdentifier("a"), createIdentifier("a")]
        const result = createIdentifier("a")
        const body = createLambdaExpression(generics, parameters, result)
        const ast = createFunctionSignature(name, body)
        expect(ast).toEqual<FunctionSignatureAst>({
          body,
          name,
          type: "FunctionSignature",
        })
      })
    })

    describe("foldTypeDeclaration", () => {
      it("folds a function signature", () => {
        const name = createIdentifier("concat")
        const generics = [createIdentifier("a")]
        const parameters = [createIdentifier("a"), createIdentifier("a")]
        const result = createIdentifier("a")
        const body = createLambdaExpression(generics, parameters, result)
        const functionSignature = createFunctionSignature(name, body) as TypeDeclarationAst
        const fold = foldTypeDeclaration({
          Function: () => "This is a function!",
          Value: () => "This is a value!",
        })
        expect(fold(functionSignature)).toBe("This is a function!")
      })

      it("folds a value signature", () => {
        const name = createIdentifier("count")
        const value = createIdentifier("number")
        const valueSignature = createValueSignature(name, value) as TypeDeclarationAst
        const fold = foldTypeDeclaration({
          Function: () => "This is a function!",
          Value: () => "This is a value!",
        })
        expect(fold(valueSignature)).toBe("This is a value!")
      })
    })
  })
})
