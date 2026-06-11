
const fs = require('fs');
const path = require('path');

/* ─── HTML output collector ─── */
const htmlChunks = [];

/* ─── Tiny colour helpers ─── */
const hex = c => `#${c}`;
const DARK_BLUE = "1F3A7A", RED_C = "C00000", GREEN_C = "006400", MEDIUM_BLUE = "2E4099";

/* ─────────────────────────────────────────
   MOCK DOCX CLASSES
   Each one records its logical intent so
   the renderer can map it to HTML.
───────────────────────────────────────── */
class DocTextRun {
  constructor(cfg) { this.cfg = typeof cfg === 'string' ? { text: cfg } : cfg; }
}
class DocPageBreak {}
class DocParagraph {
  constructor(cfg) { this.cfg = cfg; this.type = 'para'; }
}
class DocTableCell {
  constructor(cfg) { this.cfg = cfg; }
}
class DocTableRow {
  constructor(cfg) { this.cfg = cfg; }
}
class DocTable {
  constructor(cfg) { this.cfg = cfg; this.type = 'table'; }
}
class DocDocument {
  constructor(cfg) { this.cfg = cfg; }
}

/* ─── Packer mock — fires HTML generation ─── */
const DocPacker = {
  toBuffer(doc) {
    const children = doc.cfg.sections[0].children;
    const html = buildPage(children);
    fs.writeFileSync(
      path.join(__dirname, 'PLC_Exam_Handbook.html'),
      html, 'utf8'
    );
    console.log('✅  PLC_Exam_Handbook.html generated successfully!');
    return Promise.resolve(Buffer.from(''));
  }
};

/* ─── Mock module returned when build_plc.js does require('docx') ─── */
const mockDocx = {
  Document: DocDocument,
  Packer: DocPacker,
  Paragraph: DocParagraph,
  TextRun: DocTextRun,
  Table: DocTable,
  TableRow: DocTableRow,
  TableCell: DocTableCell,
  PageBreak: DocPageBreak,
  AlignmentType: { CENTER: 'center', LEFT: 'left', RIGHT: 'right', BOTH: 'justify' },
  HeadingLevel: { HEADING_1: 'h1', HEADING_2: 'h2', HEADING_3: 'h3' },
  BorderStyle: { SINGLE: 'single', NONE: 'none' },
  WidthType: { DXA: 'dxa', PCT: 'pct', AUTO: 'auto' },
  ShadingType: { CLEAR: 'clear' },
  LevelFormat: { BULLET: 'bullet' },
};

/* ══════════════════════════════════════════════════════════════
   RENDERER — converts collected ch[] elements → HTML strings
══════════════════════════════════════════════════════════════ */

function esc(s) {
  return (s || '').toString()
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderTextRun(tr) {
  const c = tr.cfg;
  const txt = esc(c.text || '');
  if (!txt) return '<br>';
  let s = '';
  if (c.bold) s += 'font-weight:700;';
  if (c.color) s += `color:${hex(c.color)};`;
  if (c.font === 'Courier New') s += 'font-family:"Courier New",Courier,monospace;font-size:.85em;';
  if (c.size && c.size >= 48) s += `font-size:${c.size/14}rem;`;
  else if (c.size && c.size >= 36) s += `font-size:${c.size/16}rem;`;
  return s ? `<span style="${s}">${txt}</span>` : txt;
}

function renderInner(children) {
  if (!children) return '';
  return children.map(ch => {
    if (ch instanceof DocTextRun) return renderTextRun(ch);
    if (ch instanceof DocPageBreak) return '';
    if (ch instanceof DocParagraph) return renderPara(ch);
    return '';
  }).join('');
}

function isCode(cfg) {
  return cfg.children && cfg.children[0] instanceof DocTextRun
      && cfg.children[0].cfg.font === 'Courier New';
}

function renderPara(el) {
  const cfg = el.cfg;
  const inner = renderInner(cfg.children || []);

  if (cfg.heading === 'h1') return `<h1 class="h1">${inner}</h1>`;
  if (cfg.heading === 'h2') return `<h2 class="h2">${inner}</h2>`;
  if (cfg.heading === 'h3') return `<h3 class="h3">${inner}</h3>`;
  if (cfg.numbering)        return `<li>${inner}</li>`;

  // Code paragraph
  if (isCode(cfg)) return `<div class="code-line">${inner}</div>`;

  // Detect h4-style (bold, GREEN, no heading level)
  if (cfg.children && cfg.children[0] instanceof DocTextRun) {
    const r = cfg.children[0].cfg;
    if (r.bold && r.color === GREEN_C) return `<h4 class="h4">${inner}</h4>`;
  }

  const align = cfg.alignment === 'center' ? ' class="center"' : '';
  return inner.trim() ? `<p${align}>${inner}</p>` : '';
}

function cellBg(cell) {
  const sh = cell.cfg.shading;
  if (!sh || !sh.fill || sh.fill === 'FFFFFF') return '';
  return hex(sh.fill);
}

function renderTable(el) {
  const rows = el.cfg.rows || [];
  let out = '<table class="doc-table"><tbody>';
  rows.forEach(row => {
    out += '<tr>';
    (row.cfg.children || []).forEach(cell => {
      const bg = cellBg(cell);
      const style = bg ? ` style="background:${bg}"` : '';
      const cellHtml = (cell.cfg.children || []).map(ch => {
        if (ch instanceof DocParagraph) return renderPara(ch);
        return '';
      }).join('');
      out += `<td${style}>${cellHtml}</td>`;
    });
    out += '</tr>';
  });
  out += '</tbody></table>';
  return out;
}

function renderElement(el) {
  if (el instanceof DocParagraph) return renderPara(el);
  if (el instanceof DocTable)     return renderTable(el);
  return '';
}

function buildBody(children) {
  const parts = [];
  let listOpen = false;

  for (const el of children) {
    const isLi = el instanceof DocParagraph && el.cfg.numbering;

    if (isLi) {
      if (!listOpen) { parts.push('<ul class="blt">'); listOpen = true; }
      parts.push(renderElement(el));
    } else {
      if (listOpen) { parts.push('</ul>'); listOpen = false; }

      // Module headings get a section wrapper
      if (el instanceof DocParagraph && el.cfg.heading === 'h1') {
        parts.push('<div class="module-section">');
        parts.push(renderElement(el));
      } else {
        parts.push(renderElement(el));
      }
    }
  }
  if (listOpen) parts.push('</ul>');
  return parts.join('\n');
}

/* ══════════════════════════════════════════════════════════════
   PAGE BUILDER — wraps body in full HTML with CSS
══════════════════════════════════════════════════════════════ */
function buildPage(children) {
  const body = buildBody(children);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Introduction to PLC — BRI515A Complete Exam Handbook</title>
<meta name="description" content="Complete PLC exam preparation handbook for BRI515A — VTU 5th semester. All 44 questions answered across 5 modules.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
/* ═══════════════════════ RESET & BASE ═══════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --dark-blue:   #1F3A7A;
  --med-blue:    #2E4099;
  --red:         #C00000;
  --green:       #006400;
  --bg:          #0D1117;
  --surface:     #161B22;
  --surface2:    #1C2333;
  --border:      #30363D;
  --text:        #E6EDF3;
  --text-muted:  #8B949E;
  --accent:      #58A6FF;
  --gold:        #D29922;
  --info-bg:     #0D2137;
  --warn-bg:     #2D1014;
  --key-bg:      #2D2000;
  --success-bg:  #0D2D14;
  --font:        'Inter', system-ui, sans-serif;
  --mono:        'JetBrains Mono', 'Courier New', monospace;
  --radius:      10px;
  --shadow:      0 4px 24px rgba(0,0,0,.45);
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  font-size: 15px;
  line-height: 1.7;
  padding: 0;
}

/* ═══════════════════════ TOP NAV ═══════════════════════ */
.top-bar {
  position: sticky; top: 0; z-index: 100;
  background: rgba(13,17,23,.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 1rem;
  padding: .65rem 2rem;
}
.top-bar .logo {
  font-weight: 700; color: var(--accent);
  font-size: .95rem; white-space: nowrap;
}
.top-bar nav { display: flex; gap: .5rem; flex-wrap: wrap; }
.top-bar nav a {
  text-decoration: none; color: var(--text-muted); font-size: .78rem;
  padding: .25rem .65rem; border-radius: 6px; transition: all .2s;
}
.top-bar nav a:hover { background: var(--surface2); color: var(--text); }

/* ═══════════════════════ HERO ═══════════════════════ */
.hero {
  background: linear-gradient(135deg, #0D1117 0%, #1F3A7A22 40%, #0D1117 100%);
  text-align: center; padding: 5rem 2rem 4rem;
  border-bottom: 1px solid var(--border);
  position: relative; overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 0%, #1F3A7A33, transparent);
  pointer-events: none;
}
.hero h1 {
  font-size: clamp(2rem, 5vw, 3.8rem);
  font-weight: 800;
  background: linear-gradient(135deg, #58A6FF, #79C0FF, #D2A8FF);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  line-height: 1.15; margin-bottom: 1rem;
}
.hero .subtitle { color: var(--text-muted); font-size: 1rem; margin-bottom: .5rem; }
.hero .badge-row { display: flex; flex-wrap: wrap; justify-content: center; gap: .5rem; margin: 1.5rem 0; }
.badge {
  display: inline-flex; align-items: center; gap: .35rem;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-size: .75rem; font-weight: 500;
  padding: .3rem .8rem; border-radius: 999px;
}
.badge.red   { border-color: #C0000066; color: #FF8080; }
.badge.blue  { border-color: #58A6FF66; color: #79C0FF; }
.badge.green { border-color: #39D35366; color: #56D364; }

/* ═══════════════════════ LAYOUT ═══════════════════════ */
.page-wrap {
  max-width: 1100px; margin: 0 auto;
  padding: 2.5rem 1.5rem 5rem;
}

/* ═══════════════════════ MODULE SECTIONS ═══════════════════════ */
.module-section { margin-top: 3rem; }

/* ═══════════════════════ HEADINGS ═══════════════════════ */
.h1 {
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: 700; color: #79C0FF;
  padding: 1rem 1.25rem; margin: 2.5rem 0 1.2rem;
  border-left: 4px solid var(--accent);
  background: linear-gradient(90deg, rgba(88,166,255,.08), transparent);
  border-radius: 0 var(--radius) var(--radius) 0;
}
.h2 {
  font-size: 1.15rem; font-weight: 600;
  color: #9ECBFF; margin: 1.8rem 0 .8rem;
  padding-bottom: .35rem;
  border-bottom: 1px solid #30363D;
}
.h3 {
  font-size: 1.05rem; font-weight: 600;
  color: #FF8080; margin: 1.5rem 0 .7rem;
}
.h4 {
  font-size: .92rem; font-weight: 600;
  color: #56D364; margin: 1.1rem 0 .45rem;
}

/* ═══════════════════════ PARAGRAPHS ═══════════════════════ */
p { margin: .5rem 0 .7rem; color: #CDD9E5; }
p.center, .center { text-align: center; }

/* ═══════════════════════ CODE ═══════════════════════ */
.code-line {
  font-family: var(--mono); font-size: .8rem;
  color: #A5D6FF; background: #0D1F35;
  padding: .15rem 1rem; white-space: pre;
  border-left: 2px solid #1F3A7A;
  line-height: 1.5; overflow-x: auto;
}
.code-line + .code-line { border-top: none; }
.code-line:first-of-type { border-radius: var(--radius) var(--radius) 0 0; padding-top: .5rem; }
.code-line:last-of-type  { border-radius: 0 0 var(--radius) var(--radius); padding-bottom: .5rem; }

/* ═══════════════════════ BULLETS ═══════════════════════ */
ul.blt { padding-left: 1.5rem; margin: .4rem 0; }
ul.blt li {
  margin: .25rem 0; color: #CDD9E5; font-size: .9rem;
  padding-left: .25rem;
}
ul.blt li::marker { color: var(--accent); }

/* ═══════════════════════ TABLES ═══════════════════════ */
.doc-table {
  width: 100%; border-collapse: collapse;
  margin: .8rem 0 1rem; font-size: .85rem;
  border-radius: var(--radius); overflow: hidden;
  box-shadow: var(--shadow);
}
.doc-table td {
  padding: .55rem .8rem; border: 1px solid #30363D;
  vertical-align: top;
}
/* First row = header row (dark-blue bg) */
.doc-table tr:first-child td {
  background: var(--dark-blue) !important;
  color: #fff; font-weight: 600; font-size: .82rem;
  text-transform: uppercase; letter-spacing: .03em;
}
/* Zebra stripes */
.doc-table tr:nth-child(even) td { background: rgba(255,255,255,.02); }
.doc-table tr:hover td { background: rgba(88,166,255,.05); }

/* Coloured box tables (simpleBox, keyBox etc.) */
.doc-table td[style*="background:#E8F4FD"],
.doc-table td[style*="background:#e8f4fd"] { background: var(--info-bg) !important; color: #79C0FF !important; }
.doc-table td[style*="background:#FFE6E6"],
.doc-table td[style*="background:#ffe6e6"] { background: var(--warn-bg) !important; color: #FF8080 !important; }
.doc-table td[style*="background:#FFF3CD"],
.doc-table td[style*="background:#fff3cd"] { background: var(--key-bg)  !important; color: #E3B341 !important; }
.doc-table td[style*="background:#E6FFE6"],
.doc-table td[style*="background:#e6ffe6"] { background: var(--success-bg) !important; color: #56D364 !important; }
.doc-table td[style*="background:#1F3A7A"] { background: #0F2050 !important; color: #fff !important; }
.doc-table td[style*="background:#FFF0E6"],
.doc-table td[style*="background:#fff0e6"] { background: #2D1800 !important; color: #FFAA55 !important; }
.doc-table td[style*="background:#F0FFF0"],
.doc-table td[style*="background:#f0fff0"] { background: #0A2010 !important; color: #56D364 !important; }

/* ═══════════════════════ SCROLL-TO-TOP ═══════════════════════ */
.back-top {
  position: fixed; bottom: 2rem; right: 2rem;
  background: var(--accent); color: #000;
  border: none; border-radius: 50%; width: 44px; height: 44px;
  font-size: 1.2rem; cursor: pointer; box-shadow: var(--shadow);
  transition: transform .2s;
}
.back-top:hover { transform: scale(1.1); }

/* ═══════════════════════ PRINT ═══════════════════════ */
@media print {
  .top-bar, .back-top, .hero { display: none; }
  body { background: #fff; color: #000; }
  .h1 { color: #1F3A7A; border-color: #1F3A7A; background: #EEF3FF; }
  .h2 { color: #2E4099; }
  .h3 { color: #C00000; }
  .h4 { color: #006400; }
  .code-line { background: #f5f5f5; color: #333; border-left-color: #999; }
  .doc-table td { border-color: #ccc; }
  .doc-table tr:first-child td { background: #1F3A7A !important; }
}

/* ═══════════════════════ RESPONSIVE ═══════════════════════ */
@media (max-width: 640px) {
  .top-bar { padding: .6rem 1rem; }
  .page-wrap { padding: 1.5rem 1rem 4rem; }
  .doc-table { font-size: .75rem; }
  .code-line { font-size: .72rem; }
}
</style>
</head>
<body>

<!-- TOP NAV -->
<header class="top-bar">
  <div class="logo">📘 BRI515A — Introduction to PLC</div>
  <nav>
    <a href="#mod1">Module 1</a>
    <a href="#mod2">Module 2</a>
    <a href="#mod3">Module 3</a>
    <a href="#mod4">Module 4</a>
    <a href="#mod5">Module 5</a>
  </nav>
</header>

<!-- HERO COVER -->
<section class="hero">
  <h1>INTRODUCTION TO PLC</h1>
  <p class="subtitle">BRI515A &nbsp;|&nbsp; 5th Semester B.E./B.Tech. &nbsp;|&nbsp; VTU, Belagavi</p>
  <div class="badge-row">
    <span class="badge blue">📋 All 44 Questions Answered</span>
    <span class="badge green">5 Modules</span>
    <span class="badge red">QP1 · QP2 · IAT Covered</span>
    <span class="badge">🏫 BIT · Dept of RAI</span>
    <span class="badge">👩‍🏫 Prof. Sunitha M K</span>
  </div>
</section>

<!-- MAIN CONTENT -->
<main class="page-wrap" id="main">
${body}
</main>

<!-- SCROLL TO TOP -->
<button class="back-top" onclick="window.scrollTo({top:0,behavior:'smooth'})" title="Back to top">↑</button>

</body>
</html>`;
}

/* ══════════════════════════════════════════════════════════════
   LOAD & RUN build_plc.js WITH MOCKED require
══════════════════════════════════════════════════════════════ */
const scriptSrc = fs.readFileSync(path.join(__dirname, 'build_plc.js'), 'utf8');

// Wrap in a function so we can inject a custom require
const wrapped = `(function(require,module,exports,__filename,__dirname,process,console,Buffer){
${scriptSrc}
})`;

const fn = eval(wrapped);

const fakeModule = { exports: {} };
const fakeRequire = id => {
  if (id === 'docx') return mockDocx;
  return require(id);
};

fn(fakeRequire, fakeModule, fakeModule.exports,
   __filename, __dirname, process, console, Buffer);
