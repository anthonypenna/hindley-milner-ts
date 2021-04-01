import * as fs from "fs"
import * as ts from "typescript"
import { pipe } from "fp-ts/lib/function"
import { emitFunctionSignature, emitValueSignature, foldTypeDeclaration, parser } from "./compiler"

function rangeToComment(sourceText: string) {
  return (range: ts.CommentRange) => {
    /**
     * Incrementing the start range by 2
     * allows us to cut off the initial comment
     * characters like // or /*
     */
    return { range, text: sourceText.slice(range.pos + 2, range.end).trim() }
  }
}

function createVisitor(sourceFile: ts.SourceFile) {
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclarationList(node)) {
      const nodeStart = node.getFullStart()
      const sourceText = sourceFile.getFullText()
      const commentRanges = ts.getLeadingCommentRanges(sourceText, nodeStart) ?? []
      const comments = commentRanges.map(rangeToComment(sourceText)).map(comment => {
        return {
          ...comment,
          ast: parser.signature.tryParse(comment.text),
        }
      })
      comments.forEach(comment => {
        const preTypeDeclarationText = sourceText.slice(0, comment.range.end)
        const typeDeclaration = pipe(
          comment.ast,
          foldTypeDeclaration({
            Function: emitFunctionSignature,
            Value: emitValueSignature,
          }),
          declaration => `\n${declaration}`
        )
        const postTypeDeclarationText = sourceText.slice(comment.range.end)
        const newSourceText = `${preTypeDeclarationText}${typeDeclaration}${postTypeDeclarationText}`
        fs.writeFileSync(sourceFile.fileName, newSourceText, { encoding: "utf8" })
      })
    }
    ts.forEachChild(node, visit)
  }

  return visit
}

function compile(fileName: string) {
  const sourceText = fs.readFileSync(fileName, { encoding: "utf8" })
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.ESNext)
  const visit = createVisitor(sourceFile)
  visit(sourceFile)
}

function main(args: string[]) {
  args.forEach(compile)
}

main(process.argv.slice(2))
