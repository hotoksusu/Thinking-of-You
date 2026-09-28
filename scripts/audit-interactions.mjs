import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export function sourceFiles(dir) {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(e => e.isDirectory() ? sourceFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
export function auditSources() {
  const findings = [];
  for (const file of [...sourceFiles('app'), ...sourceFiles('src')].filter(p => p.endsWith('.tsx'))) {
    const source = fs.readFileSync(file, 'utf8'), ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(n) {
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const tag = n.tagName.getText(ast), attrs = new Map(n.attributes.properties.filter(ts.isJsxAttribute).map(a => [a.name.getText(ast), a.initializer?.getText(ast)]));
        const spread = n.attributes.properties.some(ts.isJsxSpreadAttribute);
        const line = ast.getLineAndCharacterOfPosition(n.pos).line + 1;
        if (['button', 'Button'].includes(tag) && !spread && !attrs.has('onClick') && !attrs.has('disabled') && attrs.get('type') !== '"submit"') findings.push({file, line, problem: 'button has no action/disabled state'});
        if (['a', 'Link'].includes(tag) && !spread && (!attrs.has('href') || ['"#"', '""'].includes(attrs.get('href'))) && !attrs.has('onClick')) findings.push({file, line, problem: 'link has no destination'});
        if (attrs.has('onClick') && /=>\s*\{\s*\}/.test(attrs.get('onClick'))) findings.push({file, line, problem: 'empty click handler'});
      }
      ts.forEachChild(n, visit);
    }
    visit(ast);
  }
  return findings;
}
if (process.argv[1]?.endsWith('audit-interactions.mjs')) {
  const findings = auditSources();
  console.log(JSON.stringify(findings, null, 2));
  console.log(`Unwired controls: ${findings.length}`);
  process.exitCode = findings.length ? 1 : 0;
}
