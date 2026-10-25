import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const TS_EXTENSIONS = /\.(?:ts|tsx)$/

export async function load(url, context, nextLoad) {
  if (!TS_EXTENSIONS.test(new URL(url).pathname)) {
    return nextLoad(url, context)
  }

  const source = await readFile(new URL(url), 'utf8')
  const transpiled = ts.transpile(source, {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
  })

  return { format: 'module', shortCircuit: true, source: transpiled }
}
