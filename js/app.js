(() => {
'use strict';

/* =============== utilidades =============== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const uid = () => 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const now = () => new Date().toISOString();
const fmtD = iso => iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '') : '';
const ini = a => !a ? '·' : a.replace(/[^A-Za-zÀ-ÿ ]/g, '').split(' ').filter(Boolean).map(x => x[0]).join('').slice(0, 2).toUpperCase() || '·';
const num = n => String(n).padStart(3, '0');

/* =============== ícones =============== */
const IC = {
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9"/>',
  notes: '<path d="M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  net: '<circle cx="6" cy="6.5" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="m8.4 7.1 7.2.7M7.2 8.7l3.6 7M16.8 10.3l-3.6 5.4"/>',
  list: '<path d="M10 6.5h10M10 12h10M10 17.5h10"/><path d="m3.8 6.4 1.2 1.2 2.2-2.4M3.8 11.9l1.2 1.2 2.2-2.4M3.8 17.4l1.2 1.2 2.2-2.4"/>',
  gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.3 2.6 2.6 5-5.4"/>',
  chat: '<path d="M4 5h16v11H10l-4 4v-4H4z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.6 2.6 0 1 1 3.7 2.4c-.9.4-1.3 1-1.3 1.9M12 17v.01"/>',
  circ: '<circle cx="12" cy="12" r="7"/>',
  tick: '<path d="m6 12.5 4 4 8-9"/>',
  dtick: '<path d="m3.5 12.5 4 4 7-8M11.5 15.5l1 1 8-9"/>',
  left: '<path d="m14.5 6-6 6 6 6"/>',
  right: '<path d="m9.5 6 6 6-6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  edit: '<path d="M4 20l4.2-1L19 8.2 15.8 5 5 15.8z"/><path d="m13.8 7 3.2 3.2"/>',
  down: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  up: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14.5-3.5M4 4v4h4M4 13a8 8 0 0 0 14.5 3.5M20 20v-4h-4"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 6.2A9.7 9.7 0 0 1 12 6c5 0 8.5 4.2 9.5 6-.4.7-1.2 1.8-2.4 2.9M6.5 7.7C4.4 9 3 11 2.5 12c1 1.8 4.5 6 9.5 6 1.6 0 3-.4 4.2-1M9.9 10a3 3 0 0 0 4.1 4.1"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'
};
const ic = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* =============== constantes =============== */
const TIPOS = ['Chamada', 'História', 'Ensinamento', 'Palavra', 'Sessão', 'Nota livre'];
const CZ = [null,
  { n: 'Confirmado', i: 'check', d: 'Vi ou ouvi diretamente da fonte' },
  { n: 'Ouvi de alguém', i: 'chat', d: 'Sei por quem me contou' },
  { n: 'Memória', i: 'clock', d: 'Lembro, mas não confirmei' },
  { n: 'Dúvida', i: 'help', d: 'Não tenho certeza se é assim' }];
const ST = ['Ainda não vi', 'Vi ou ouvi', 'Anotei'];
const ST_IC = ['circ', 'tick', 'dtick'];
const ESTILOS = [
  ['vidro', 'Vidro líquido', 'Camadas translúcidas sobre cores suaves'],
  ['fichario', 'Fichário', 'Fichas de papel numeradas, cantos retos'],
  ['bolhas', 'Bolhas', 'Formas redondas e sombras macias'],
  ['feed', 'Feed', 'Conversa por autor, em balões'],
  ['constelacao', 'Constelação', 'Noite com notas como estrelas ligadas por linhas']];
const PAL = [
  ['Jade', ['#EAF4F0', '#FFFFFF', '#10241D', '#5B7A70', '#CFE3DB', '#0E7C66', '#5BC0A4'], ['#0B1714', '#12251F', '#DDF1EA', '#8DB3A6', '#1E3A31', '#4ED1B0', '#2A7F9E']],
  ['Safira', ['#EBF1FB', '#FFFFFF', '#0F1A33', '#5F7099', '#D3DEF2', '#1F4FBF', '#7AA7F5'], ['#0A1020', '#111B35', '#E3EBFB', '#8A9CC4', '#1F2D52', '#6EA0FF', '#8B6CFF']],
  ['Ametista', ['#F3EEFB', '#FFFFFF', '#241638', '#7B6A9C', '#E2D8F3', '#7440C9', '#E07BC6'], ['#140E24', '#1E1636', '#EEE6FB', '#A898CC', '#33264F', '#B58CFF', '#FF7AC8']],
  ['Âmbar', ['#FBF3E2', '#FFFFFF', '#3A2808', '#8A7448', '#EBDDBB', '#B26A00', '#E8B04A'], ['#17110A', '#241A0E', '#F5E8D2', '#B8A27E', '#3B2B17', '#F2A93B', '#D8602F']],
  ['Rubi', ['#FCEEEE', '#FFFFFF', '#3A1015', '#8F6068', '#F0D3D6', '#B3202E', '#F08A6A'], ['#1A0C0F', '#281318', '#F8E4E6', '#C29A9F', '#44212A', '#FF6B7D', '#FFB26B']],
  ['Oceano', ['#E9F5FA', '#FFFFFF', '#0B2430', '#58828F', '#CBE4EE', '#0A7AA8', '#54C6D6'], ['#07161D', '#0D2531', '#DCF1F8', '#86B2C4', '#153A4B', '#3FC1E8', '#3F7BE8']],
  ['Lima', ['#F1F2EE', '#FFFFFF', '#1D2217', '#6E7766', '#DADDD2', '#4C7A0D', '#A5D12F'], ['#121412', '#1B1E1A', '#E9EDE4', '#9AA392', '#2C3128', '#B6E34A', '#4FB286']],
  ['Coral', ['#F6F1EF', '#FFFFFF', '#2A1812', '#8A736A', '#E8DAD4', '#D1492F', '#F4A261'], ['#141211', '#211D1B', '#F2EAE6', '#AFA29C', '#36302D', '#FF7A59', '#F2C14E']],
  ['Aurora', ['#F4F0F8', '#FFFFFF', '#241833', '#7D6F96', '#E3DAEF', '#C0307F', '#2CA7C9'], ['#0F0D1A', '#1A1730', '#F0ECFB', '#A39FC4', '#2C2750', '#FF6FB5', '#4FD6F0']],
  ['Musgo', ['#F2EFE6', '#FFFFFF', '#23250F', '#7A7C5C', '#E1DEC9', '#5E6B2C', '#B98B3E'], ['#12130C', '#1C1E12', '#ECEBD9', '#A5A68A', '#2D3020', '#A9BC5A', '#D4A24E']],
  ['Turquesa', ['#E6F7F7', '#FFFFFF', '#06282B', '#4F8085', '#C5E6E8', '#00838F', '#7C4DFF'], ['#061719', '#0C2528', '#D9F3F4', '#7FB0B4', '#134045', '#26C6DA', '#B388FF']],
  ['Magenta', ['#FBEAF4', '#FFFFFF', '#35091F', '#8F5A74', '#F1CFE0', '#AD1457', '#7C4DFF'], ['#190812', '#29101D', '#F9E1EE', '#C494AE', '#46182F', '#FF4F9A', '#B388FF']],
  ['Lavanda', ['#EFEDFB', '#FFFFFF', '#1C1740', '#6F6B9E', '#DAD6F3', '#5C4FD6', '#2CB5D8'], ['#0E0D1F', '#181636', '#E8E6FA', '#9C99C8', '#2A2658', '#8E86FF', '#5CD6F5']],
  ['Cobre', ['#F8EEE6', '#FFFFFF', '#34190A', '#8E6B52', '#EBD6C6', '#A8541F', '#2F7D8A'], ['#170E09', '#25160D', '#F4E3D5', '#B99A84', '#3F2415', '#E8803F', '#F2C078']],
  ['Esmeralda', ['#E7F6EC', '#FFFFFF', '#0B2A17', '#4F8A66', '#C8E8D3', '#14803C', '#00A38F'], ['#07150C', '#0E2416', '#DDF3E4', '#84B594', '#173A25', '#3DDC84', '#00BFA5']],
  ['Bordô', ['#F7EDEA', '#FFFFFF', '#2E0E18', '#8D6068', '#E9D2CD', '#6D1A2F', '#B78A1F'], ['#160A0D', '#25121A', '#F3E6E3', '#B89A9C', '#3E1D27', '#D9576F', '#E3B341']],
  ['Névoa', ['#EEF1F4', '#FFFFFF', '#16202B', '#66778A', '#D6DDE5', '#4A6A8A', '#8E7AD1'], ['#0F1318', '#181E26', '#E6EBF1', '#92A0B2', '#27303C', '#7FA6CF', '#A58FE0']],
  ['Pôr do sol', ['#FDF0E8', '#FFFFFF', '#3A1812', '#946A5E', '#F2D8CB', '#D1495B', '#E48A2B'], ['#1B0F0C', '#2B1914', '#F9E6DD', '#C3A094', '#482B22', '#FF7B6B', '#FFC15E']],
  ['Floresta', ['#EAF1EC', '#FFFFFF', '#14261B', '#5D7A68', '#D0E0D5', '#2D5A3D', '#A38B2E'], ['#0A110D', '#121D16', '#DFEAE2', '#8AA595', '#1F3427', '#7FBF8E', '#D9C46A']],
  ['Tinta', ['#FAF8F3', '#FFFFFF', '#14202C', '#6F7881', '#E6E2D8', '#1C3D5A', '#B5651D'], ['#0D0D0F', '#17171A', '#EDEBE6', '#9B9A94', '#28282D', '#8CB4E0', '#D9955B']]
];
const TEMAS0 = [['Jesus', ['Cristo', 'Messias']], ['Deus', []], ['Estrela', ['Estrelas']], ['Lua', []], ['Sol', []], ['Amor', []], ['Luz', []], ['Caminho', []], ];

/* =============== dados =============== */
const KEY = 'cerebro.v1';
let DB = null, saveT = 0;
const cfg0 = () => ({ estilo: 'vidro', paleta: 1, escuro: true, esc: 'auto', auto: 1, txt: 1, contr: 1, caixa: 80, fonte: 'serif', sync: { repo: '', token: '', branch: 'main', path: 'cerebro-dados.json', ultima: '' } });

function mkDB(seed) {
  const t = now();
  const cat = {};
  Object.entries(seed.catalogo).forEach(([k, gs]) => cat[k] = gs.map((g, i) => ({ id: g.id || k.slice(0, 2) + i, nome: g.nome, extra: g.extra || 0, itens: g.itens.map(x => ({ n: x.n, s: x.s })) })));
  return {
    v: 1, notas: seed.notas, catalogo: cat,
    temas: TEMAS0.map((x, i) => ({ id: 't' + i, nome: x[0], apelidos: x[1] })),
    apagadas: {}, ts: { catalogo: t, temas: t }, cfg: cfg0(), atualizado: t
  };
}
function save() {
  DB.atualizado = now();
  clearTimeout(saveT);
  saveT = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { toast('Não consegui salvar no aparelho'); } }, 150);
  agendarSync();
}
async function boot() {
  try { const r = localStorage.getItem(KEY); if (r) DB = JSON.parse(r); } catch (e) { DB = null; }
  if (!DB || !Array.isArray(DB.notas)) {
    let seed = null;
    try { const r = await fetch('data/seed.json'); if (r.ok) seed = await r.json(); } catch (e) { }
    DB = mkDB(seed || { notas: [], catalogo: { 'Chamadas': [], 'Histórias': [] } });
    if (!seed) DB.ts = { catalogo: '1970-01-01T00:00:00Z', temas: '1970-01-01T00:00:00Z' }; // vazio: os dados remotos vencem na primeira sincronização
    try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { }
  }
  DB.cfg = Object.assign(cfg0(), DB.cfg || {}); DB.cfg.sync = Object.assign(cfg0().sync, DB.cfg.sync || {});
  DB.apagadas = DB.apagadas || {}; DB.ts = DB.ts || { catalogo: now(), temas: now() };
  aplicar(); montar(); render(); agendarSync(1500);
}

/* =============== tema visual =============== */
const lum = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4); return .2126 * r + .7152 * g + .0722 * b; };
function aplicar() {
  const c = DB.cfg, p = PAL[c.paleta] || PAL[1], v = c.escuro ? p[2] : p[1], rs = document.documentElement.style;
  ['bg', 'cd', 'ink', 'mut', 'ln', 'ac', 'ac2'].forEach((k, i) => rs.setProperty('--' + k, v[i]));
  rs.setProperty('--onac', lum(v[5]) > .42 ? '#0b0d12' : '#ffffff');
  // leitura: contraste do texto (0 normal, 1 alto, 2 máximo), tamanho das notas, opacidade das caixas, fonte, escala da tela
  const k = [72, 86, 100][c.contr == null ? 1 : c.contr], pole = c.escuro ? '#fff' : '#000';
  rs.setProperty('--mut', `color-mix(in srgb, ${v[2]} ${k}%, ${v[0]})`);
  rs.setProperty('--ink', c.contr === 2 ? `color-mix(in srgb, ${v[2]} 70%, ${pole})` : v[2]);
  rs.setProperty('--tx', c.txt || 1); rs.setProperty('--cx', (c.caixa || 80) + '%');
  if (c.fonte === 'sans') rs.setProperty('--fnl', 'Inter,system-ui,-apple-system,"Segoe UI",sans-serif'); else rs.removeProperty('--fnl');
  escala();
  rs.colorScheme = c.escuro ? 'dark' : 'light';
  document.body.dataset.estilo = c.estilo; document.body.dataset.tema = c.escuro ? 'escuro' : 'claro';
  const m = $('meta[name=theme-color]'); if (m) m.content = v[0];
}

function escala() {
  const c = DB.cfg, z = c.esc === 'auto' || !c.esc ? Math.min(1.5, Math.max(1, Math.round(innerWidth / 1440 * 100) / 100)) : +c.esc;
  document.documentElement.style.setProperty('--z', innerWidth <= 860 && (c.esc === 'auto' || !c.esc) ? 1 : z);
}
let rzT = 0; addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(() => DB && escala(), 150); });

/* =============== lógica de notas =============== */
const ncache = new Map(), tcache = new Map();
function hay(n) {
  const k = n.id + n.atualizado; let r = ncache.get(k);
  if (!r) { r = norm([n.titulo, n.texto, n.autor, n.quemFalou, (n.tags || []).join(' ')].join(' ')); ncache.set(k, r); }
  return r;
}
function temasDe(n) {
  const key = n.id + '|' + n.atualizado + '|' + DB.ts.temas; let r = tcache.get(key); if (r) return r;
  const tx = ' ' + norm(n.titulo + ' ' + n.texto) + ' ', set = new Set();
  if (n.temaModo === 'nenhum') { tcache.set(key, []); return []; }
  if (n.temaModo === 'manual') (n.temas || []).forEach(t => set.add(t));
  else DB.temas.forEach(t => { if ([t.nome, ...t.apelidos].map(norm).filter(Boolean).some(k => tx.includes(' ' + k + ' ') || tx.includes(' ' + k + 's '))) set.add(t.nome); });
  (n.texto.match(/\[\[([^\]]+)\]\]/g) || []).forEach(m => set.add(m.slice(2, -2).trim()));
  r = [...set]; tcache.set(key, r); return r;
}
const S = { q: '', tipo: '', cz: 0, autor: '', tema: '', ord: 'rec', catTab: 'Chamadas', catF: -1, catEdit: false, tag: '', cq: '', open: {}, node: '', rTipo: '', syncMsg: '' };
function filtrar(skip = '') {
  const ws = norm(S.q).split(' ').filter(Boolean);
  let l = DB.notas.filter(n => (skip === 'tipo' || !S.tipo || n.tipo === S.tipo) && (skip === 'cz' || !S.cz || n.certeza === S.cz) && (!S.autor || n.autor === S.autor)
    && (!S.tag || (n.tags || []).includes(S.tag)) && (!S.tema || temasDe(n).includes(S.tema)) && ws.every(w => hay(n).includes(w)));
  l.sort(S.ord === 'az' ? (a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR') : (a, b) => (b.atualizado || '').localeCompare(a.atualizado || ''));
  return l;
}
const autores = () => [...new Set(DB.notas.map(n => n.autor).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
const contaTemas = () => { const m = {}; DB.notas.forEach(n => temasDe(n).forEach(t => m[t] = (m[t] || 0) + 1)); return Object.entries(m).sort((a, b) => b[1] - a[1]); };
const KT = { Chamadas: 'Chamada', 'Histórias': 'História' };
let autoIdx = null;
function notasDoItem(k, it) {
  if (Array.isArray(it.links)) return it.links.map(id => DB.notas.find(n => n.id === id)).filter(Boolean);
  if (!autoIdx) { autoIdx = {}; DB.notas.forEach(n => { const key = n.tipo + '|' + norm(n.titulo); (autoIdx[key] = autoIdx[key] || []).push(n); }); }
  return autoIdx[KT[k] + '|' + norm(it.n)] || [];
}
function itensDaNota(n) {
  const out = [];
  Object.keys(KT).forEach(k => DB.catalogo[k].forEach(g => g.itens.forEach((it, i) => { if (notasDoItem(k, it).some(x => x.id === n.id)) out.push({ k, g, i, it }); })));
  return out;
}
function tagsConta() {
  const m = {}; DB.notas.forEach(n => (n.tags || []).forEach(t => { const o = m[t] = m[t] || { n: 0, c: 0 }; o.n++; if (n.certeza === 1) o.c++; }));
  return Object.entries(m).sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0], 'pt-BR'));
}
const czChip = n => `<span class="cz cz${n}">${ic(CZ[n].i, 15)}${CZ[n].n}</span>`;

/* =============== catálogo: contas =============== */
function stats(k) {
  let tot = 0, a = 0, b = 0;
  DB.catalogo[k].forEach(g => { tot += g.itens.length + (g.extra || 0); g.itens.forEach(i => { if (i.s >= 1) a++; if (i.s === 2) b++; }); });
  return { tot, known: a, anot: b, vi: a - b, nao: tot - a };
}
const gStats = g => { const t = g.itens.length + (g.extra || 0), a = g.itens.filter(i => i.s >= 1).length, b = g.itens.filter(i => i.s === 2).length; return { tot: t, known: a, anot: b, vi: a - b }; };
const pct = (a, t) => t ? a / t * 100 : 0;
function ring(k) {
  const s = stats(k), R = 52, L = 2 * Math.PI * R, p1 = pct(s.known, s.tot) / 100, p2 = pct(s.anot, s.tot) / 100;
  return `<div class="ring"><svg width="100%" height="100%" viewBox="0 0 132 132" role="img" aria-label="${k}: ${s.known} de ${s.tot}"><circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--hov)" stroke-width="12"/>
  <circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--c2)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${p1 * L} ${L}" transform="rotate(-90 66 66)"/>
  <circle cx="66" cy="66" r="${R}" fill="none" stroke="var(--c1)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${p2 * L} ${L}" transform="rotate(-90 66 66)"/></svg>
  <div class="rc"><div>${Math.round(p1 * 100)}%<small>${s.known} de ${s.tot}</small></div></div></div>`;
}
const legend = s => `<div class="legend"><span><i class="sw" style="background:var(--c1)"></i><b>${s.anot}</b> anotadas</span><span><i class="sw" style="background:var(--c2)"></i><b>${s.vi}</b> vistas ou ouvidas</span><span><i class="sw" style="background:var(--hov);outline:1px solid var(--ln)"></i><b>${s.nao}</b> ainda não</span></div>`;

/* =============== casca =============== */
const ROTAS = [['inicio', 'home', 'Início'], ['notas', 'notes', 'Notas'], ['rede', 'net', 'Rede'], ['catalogo', 'list', 'Catálogo']];
function montar() {
  $('#app').innerHTML = `<div class="bg-blobs"></div><div class="shell"><aside class="side" id="side"></aside><main class="main" id="main"></main></div><nav class="tabbar" id="tabbar" aria-label="Navegação"></nav><div id="modal"></div><div id="toast"></div>`;
}
function menus(r) {
  const on = p => r.p === p || (p === 'notas' && r.p === 'nota');
  $('#side').innerHTML = `<div class="brand"><div class="mark">${LOGO}</div><div><div class="bname">Lume Guia</div><div class="bsub">Alta Memória</div></div></div>
  <button class="btn pri wide" data-act="nova">${ic('plus', 17)} Nova nota</button>
  <div class="nlab">Navegar</div>
  <nav class="nav">${ROTAS.map(([p, i, t]) => `<a href="#/${p}" class="${on(p) ? 'on' : ''}"><span class="tile">${ic(i, 18)}</span>${t}${p === 'notas' ? `<span class="cnt">${DB.notas.length}</span>` : ''}</a>`).join('')}</nav>
  <div class="nlab">Sistema</div>
  <nav class="nav"><a href="#/config" class="${r.p === 'config' ? 'on' : ''}"><span class="tile">${ic('gear', 18)}</span>Configurações</a></nav>
  <div class="sfoot"><div><span class="dot ${navigator.onLine ? '' : 'off'}"></span>${navigator.onLine ? 'Online' : 'Offline, tudo salvo no aparelho'}</div><div id="sfstat">${esc(S.syncMsg || (DB.cfg.sync.ultima ? 'Sincronizado ' + fmtD(DB.cfg.sync.ultima) : 'Sem sincronização'))}</div></div>`;
  $('#tabbar').innerHTML = [['inicio', 'home', 'Início'], ['notas', 'notes', 'Notas']].map(([p, i, t]) => `<a href="#/${p}" class="${on(p) ? 'on' : ''}">${ic(i, 22)}${t}</a>`).join('')
    + `<button class="plus" data-act="nova" aria-label="Nova nota"><span class="pb">${ic('plus', 24)}</span></button>`
    + [['rede', 'net', 'Rede'], ['catalogo', 'list', 'Catálogo']].map(([p, i, t]) => `<a href="#/${p}" class="${on(p) ? 'on' : ''}">${ic(i, 22)}${t}</a>`).join('');
}
const route = () => { const [p, a, b] = (location.hash.replace(/^#\/?/, '') || 'inicio').split('/'); return { p, a, b }; };
let lastP = '', lastA = '';
function render() {
  const r = route(); menus(r); autoIdx = null;
  const grupo = p => p === 'nota' ? 'notas' : p, igual = grupo(lastP) === grupo(r.p);
  const m = $('#main'), y = m.scrollTop, ids = ['nlist', 'catlist'], pos = {};
  ids.forEach(i => { const e = $('#' + i); if (e) pos[i] = e.scrollTop; });
  const v = { inicio: vInicio, notas: vNotas, nota: vNotas, rede: vRede, catalogo: vCat, config: vConfig }[r.p] || vInicio;
  const fx = r.p === 'notas' || r.p === 'nota' ? 'fixn' : r.p === 'catalogo' ? 'fixc' : '';
  m.innerHTML = `<div class="page ${fx}">${v(r)}</div>`;
  if (igual) { m.scrollTo({ top: y, behavior: 'instant' }); ids.forEach(i => { const e = $('#' + i); if (e && pos[i] != null) e.scrollTop = pos[i]; }); } else m.scrollTop = 0;
  if (igual && r.p === 'nota' && r.a !== lastA && innerWidth <= 1060) m.scrollTop = 0;
  if (!igual) { const e = $('.nrow.sel'); if (e && innerWidth > 1060) e.scrollIntoView({ block: 'nearest' }); }
  lastP = r.p; lastA = r.a || '';
  if (r.p === 'rede') desenharRede();
}
window.addEventListener('hashchange', () => { fechar(); render(); });
const head = (t, sub, act = '') => `<header class="phead"><div><h1>${t}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div><div class="pact">${act}<a class="btn ghost gear" href="#/config" aria-label="Configurações">${ic('gear', 20)}</a></div></header>`;

/* =============== início =============== */
function rowNota(n, sel) {
  const tx = (n.texto || '').replace(/\s+/g, ' ').trim();
  return `<a class="nrow ${sel ? 'sel' : ''}" href="#/notas/${n.id}"><span class="av">${esc(ini(n.autor))}</span><span class="nbody"><span class="nt">${esc(n.titulo)}</span>
  <span class="nm"><span class="tag tipo">${n.tipo}</span>${n.autor ? `<span class="tag">${esc(n.autor)}</span>` : ''}${czChip(n.certeza)}</span>${tx ? `<span class="ns">${esc(tx.slice(0, 160))}</span>` : ''}</span><span class="ficha">Nº ${num(DB.notas.indexOf(n) + 1)}</span></a>`;
}
function progCard(k) {
  const s = stats(k);
  return `<a class="card sumcard" href="#/catalogo" data-act="cat" data-k="${k}">${ring(k)}<div class="sumbody"><div class="lbl">${k}</div><div style="font:500 22px/1.2 var(--fnh);margin:4px 0 10px">${s.known} de ${s.tot} conhecidas</div><div class="bar"><i class="b2" style="width:${pct(s.anot, s.tot)}%"></i><i class="b1" style="width:${pct(s.vi, s.tot)}%"></i></div>${legend(s)}</div></a>`;
}
function vInicio() {
  const sem = DB.notas.filter(n => n.certeza !== 1).length;
  const rec = [...DB.notas].sort((a, b) => (b.atualizado || '').localeCompare(a.atualizado || '')).slice(0, 5);
  const conf = DB.notas.filter(n => n.certeza === 4).concat(DB.notas.filter(n => n.certeza === 3)).slice(0, 4);
  if (!DB.notas.length && !DB.catalogo.Chamadas.length) return head('Olá, Jayme', 'Vamos começar')
    + `<div class="card"><h2 style="font:500 22px/1.2 var(--fnh);margin-bottom:10px">Traga suas notas para cá</h2><p style="margin-bottom:16px;max-width:60ch">Este aparelho ainda está vazio. Sincronize com o seu repositório privado do GitHub ou restaure um backup. Também dá para importar do Evernote ou começar uma nota nova.</p><div class="chips"><a class="btn pri" href="#/config">${ic('sync', 16)} Sincronizar ou importar</a><button class="btn" data-act="nova">${ic('plus', 16)} Nova nota</button></div></div>`;
  return head('Olá, Jayme', `${DB.notas.length} notas · ${sem} ainda sem confirmação`)
    + sbox('qhome', 'Buscar em tudo: palavra, tema, autor', '')
    + `<section class="sec"><h3>Quanto você já conhece</h3><div class="grid2">${progCard('Chamadas')}${progCard('Histórias')}</div></section>`
    + `<section class="sec"><h3>Temas em alta</h3><div class="chips">${contaTemas().slice(0, 12).map(([t, c]) => `<button class="chip" data-act="tema" data-v="${esc(t)}">${esc(t)} <span class="n">${c}</span></button>`).join('') || '<span class="hint">Nenhum tema ainda.</span>'}</div></section>`
    + `<section class="sec"><h3>Continue de onde parou</h3><div class="listcol">${rec.map(n => rowNota(n)).join('')}</div></section>`
    + `<section class="sec"><h3>Para confirmar</h3><div class="listcol">${conf.map(n => rowNota(n)).join('') || '<div class="vazio">Tudo confirmado.</div>'}</div></section>`;
}

/* =============== notas =============== */
function prose(t) { return esc(t).replace(/\[\[([^\]]+)\]\]/g, (m, x) => `<span class="lk" data-act="tema" data-v="${x}">${x}</span>`); }
function detalhe(n) {
  const tm = temasDe(n), cats = itensDaNota(n), c = CZ[n.certeza], modo = n.temaModo || 'auto';
  const rel = DB.notas.filter(o => o.id !== n.id).map(o => [o, temasDe(o).filter(t => tm.includes(t))]).filter(x => x[1].length).sort((a, b) => b[1].length - a[1].length).slice(0, 6);
  const pres = rel.filter(x => x[0].certeza === 1).length;
  return `<article class="card reader"><div class="rhead"><button class="btn ghost back" data-act="voltar">${ic('left', 18)} Notas</button>
  <div class="ractions"><button class="btn sm" data-act="editar" data-id="${n.id}">${ic('edit', 16)} Editar</button><button class="btn sm ghost dng" data-act="apagar" data-id="${n.id}" aria-label="Excluir">${ic('trash', 16)}</button></div></div>
  <div class="kicker">${n.tipo}${n.autor ? ' · ' + esc(n.autor) : ''}</div><h2 class="rtitle">${esc(n.titulo)}</h2>
  <div class="czbox cz${n.certeza}"><span class="czico">${ic(c.i, 20)}</span><div><b>${c.n}</b>
  ${n.certeza === 2 ? `<span class="t">${n.quemFalou ? 'Versão contada por <strong>' + esc(n.quemFalou) + '</strong>' : 'Falta registrar quem contou esta versão'}</span>` : `<span class="t">${c.d}</span>`}
  ${n.comoConfirmei ? `<span class="t" style="margin-top:6px;color:var(--mut)">${esc(n.comoConfirmei)}</span>` : ''}</div></div>
  <div class="prose">${n.texto ? prose(n.texto) : '<span class="hint">Nota sem texto.</span>'}</div>
  ${cats.length ? `<div class="sec"><h3>No catálogo</h3><div class="chips">${cats.map(c2 => `<a class="chip" href="#/catalogo" data-act="cat" data-k="${c2.k}">${esc(c2.g.nome)} · ${esc(c2.it.n)} · ${ST[c2.it.s]}</a>`).join('')}</div></div>` : ''}
  <div class="sec"><h3>Temas · ${modo === 'auto' ? 'achados pelo texto' : modo === 'manual' ? 'escolhidos por você' : 'nenhum'}</h3><div class="chips">${tm.map(t => `<button class="chip" data-act="tema" data-v="${esc(t)}">${esc(t)}</button>`).join('')}${tm.length ? '' : '<span class="hint">Esta nota não tem tema.</span>'}<button class="btn sm" data-act="mtemas" data-id="${n.id}">Mudar temas</button></div></div>
  ${rel.length ? `<div class="sec"><h3>Relacionadas pelos temas · ${rel.length} notas, ${pres} confirmadas</h3><div class="rel">${rel.map(([o, t]) => `<a href="#/notas/${o.id}"><span class="t">${esc(o.titulo)}</span><span class="sh">${esc(t.join(', '))}</span>${czChip(o.certeza)}</a>`).join('')}</div></div>` : ''}
  <div class="sec"><h3>Detalhes</h3><div class="chips"><span class="tag">${n.visib === 'compartilhavel' ? 'Compartilhável' : 'Privada'}</span>${n.reservada ? `<span class="tag">${ic('eyeoff', 13)}&nbsp;Fora do chat</span>` : ''}${n.criado ? `<span class="tag">Criada ${fmtD(n.criado)}</span>` : ''}${(n.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div></div></article>`;
}
function listaHTML(list, sel) { return list.length ? list.map(n => rowNota(n, n.id === sel)).join('') : '<div class="vazio">Nenhuma nota com esses filtros.</div>'; }
const sbox = (id, ph, val) => `<div class="sbox"><label class="search">${ic('search', 19)}<input id="${id}" value="${esc(val || '')}" placeholder="${ph}" autocomplete="off"></label><div class="sug" hidden></div></div>`;
function facetas() {
  const lt = filtrar('tipo'), lc = filtrar('cz'), tc = {}, zc = {};
  lt.forEach(n => tc[n.tipo] = (tc[n.tipo] || 0) + 1); lc.forEach(n => zc[n.certeza] = (zc[n.certeza] || 0) + 1);
  const tot = {}; DB.notas.forEach(n => tot[n.tipo] = 1);
  return `<div class="chips scroll"><button class="chip ${!S.tipo ? 'on' : ''}" data-act="ftipo" data-v="">Todas <span class="n">${lt.length}</span></button>${TIPOS.filter(t => tot[t]).map(t => `<button class="chip ${S.tipo === t ? 'on' : ''}" data-act="ftipo" data-v="${t}">${t} <span class="n">${tc[t] || 0}</span></button>`).join('')}</div>
    <div class="chips scroll"><button class="chip ${!S.cz ? 'on' : ''}" data-act="fcz" data-v="0">Qualquer certeza <span class="n">${lc.length}</span></button>${[1, 2, 3, 4].map(i => `<button class="chip ${S.cz === i ? 'on' : ''}" data-act="fcz" data-v="${i}">${ic(CZ[i].i, 15)}${CZ[i].n} <span class="n">${zc[i] || 0}</span></button>`).join('')}</div>`;
}
function vNotas(r) {
  const sel = r.a ? DB.notas.find(n => n.id === r.a) : null, list = filtrar();
  const ac = {}; DB.notas.forEach(n => { if (n.autor) ac[n.autor] = (ac[n.autor] || 0) + 1; });
  const tcs = Object.fromEntries(contaTemas()), tgs = tagsConta();
  return head('Notas', `<span id="ncount">${list.length} de ${DB.notas.length}</span>`, `<button class="btn" data-act="mtags">Etiquetas</button><button class="btn pri" data-act="nova">${ic('plus', 17)} Nova nota</button>`)
    + `<div class="toolbar ${sel ? 'hide' : ''}">${sbox('qn', 'Buscar nas notas', S.q)}
    <div id="fchips" style="display:flex;flex-direction:column;gap:12px">${facetas()}</div>
    <div class="frow"><select class="in" id="fautor" aria-label="Autor"><option value="">Todos os autores</option>${autores().map(a => `<option value="${esc(a)}" ${S.autor === a ? 'selected' : ''}>${esc(a)} (${ac[a]})</option>`).join('')}</select>
    <select class="in" id="ftema" aria-label="Tema"><option value="">Todos os temas</option>${DB.temas.map(t => `<option value="${esc(t.nome)}" ${S.tema === t.nome ? 'selected' : ''}>${esc(t.nome)} (${tcs[t.nome] || 0})</option>`).join('')}</select>
    <select class="in" id="ftag" aria-label="Etiqueta"><option value="">Todas as etiquetas</option>${tgs.map(([t, o]) => `<option value="${esc(t)}" ${S.tag === t ? 'selected' : ''}>${esc(t)} (${o.n})</option>`).join('')}</select>
    <select class="in" id="ford" aria-label="Ordem"><option value="rec" ${S.ord === 'rec' ? 'selected' : ''}>Mais recentes</option><option value="az" ${S.ord === 'az' ? 'selected' : ''}>A a Z</option></select></div></div>
    <div class="split ${sel ? 'has-sel' : ''}"><div class="listcol" id="nlist">${listaHTML(list, sel && sel.id)}</div><div class="detcol">${sel ? detalhe(sel) : '<div class="card vazio">Escolha uma nota para ler aqui.</div>'}</div></div>`;
}

/* =============== sugestões de busca =============== */
function sugItens(ctx, q, ex) {
  const w = norm(q); if (!w) return [];
  const ws = w.split(' '), ok = t => { const h = norm(t); return ws.every(x => h.includes(x)); }, rk = t => norm(t).startsWith(w) ? 0 : 1;
  let l = [];
  if (ctx === 'notas') {
    autores().filter(ok).slice(0, 3).forEach(a => l.push({ k: 'Autor', l: a, act: 'sugfiltro', t: 'autor', v: a }));
    DB.temas.map(t => t.nome).filter(ok).slice(0, 3).forEach(a => l.push({ k: 'Tema', l: a, act: 'sugfiltro', t: 'tema', v: a }));
    tagsConta().map(x => x[0]).filter(ok).slice(0, 3).forEach(a => l.push({ k: 'Etiqueta', l: a, act: 'sugfiltro', t: 'tag', v: a }));
    DB.notas.filter(n => ok(n.titulo)).slice(0, 12).forEach(n => l.push({ k: n.tipo, l: n.titulo, act: 'sugnota', v: n.id }));
  } else if (ctx === 'cat') {
    DB.catalogo[S.catTab].forEach(g => { if (ok(g.nome)) l.push({ k: S.catTab === 'Chamadas' ? 'Autor' : 'Grupo', l: g.nome, act: 'sugcat', v: g.nome }); g.itens.forEach(x => { if (ok(x.n)) l.push({ k: 'Item', l: x.n, act: 'sugcat', v: x.n }); }); });
  } else if (ctx === 'link') {
    DB.notas.filter(n => !ex.includes(n.id) && ok(n.titulo + ' ' + (n.autor || ''))).slice(0, 12).forEach(n => l.push({ k: n.tipo, l: n.titulo, act: 'dolink', v: n.id }));
  }
  const ord = l.map((x, i) => [x, i]).sort((a, b) => rk(a[0].l) - rk(b[0].l) || a[1] - b[1]).map(x => x[0]);
  return ord.slice(0, 8);
}
function mostrarSug(inp, ctx) {
  const box = inp.closest('.sbox'); if (!box) return; const el = $('.sug', box);
  let ex = []; if (ctx === 'link') { const k = inp.dataset.k, g = grp(k, inp.dataset.g); ex = notasDoItem(k, g.itens[+inp.dataset.i]).map(n => n.id); }
  const l = sugItens(ctx, inp.value, ex);
  if (!l.length) { el.hidden = true; el.innerHTML = ''; return; }
  const dd = inp.dataset;
  el.innerHTML = l.map(x => `<button type="button" data-act="${x.act}" data-v="${esc(x.v)}" ${x.t ? `data-t="${x.t}"` : ''} ${x.act === 'dolink' ? `data-n="${esc(x.v)}" data-k="${esc(dd.k)}" data-g="${esc(dd.g)}" data-i="${esc(dd.i)}"` : ''}><span class="sk">${esc(x.k)}</span><span class="sl">${esc(x.l)}</span></button>`).join('');
  el.hidden = false;
}
const fecharSug = () => $$('.sug').forEach(e => { e.hidden = true; });
const ctxDe = id => id === 'qc' ? 'cat' : id === 'qlink' ? 'link' : (id === 'qn' || id === 'qhome') ? 'notas' : '';

/* =============== editor =============== */
function modal(html) { fecharSug(); $('#modal').innerHTML = `<div class="modal" data-act="fundo"><div class="modal-box" role="dialog" aria-modal="true">${html}</div></div>`; }
const fechar = () => { $('#modal').innerHTML = ''; if (S.pendRender) { S.pendRender = false; setTimeout(render, 0); } };
function toast(m) { const t = $('#toast'); t.innerHTML = `<div class="toast" role="status">${esc(m)}</div>`; clearTimeout(toast.t); toast.t = setTimeout(() => t.innerHTML = '', 2800); }
function temaBloco(n) {
  const modo = n.temaModo || 'auto', atual = n.id ? temasDe(n) : [], marc = new Set(modo === 'manual' ? (n.temas || []) : atual);
  const nomes = [...new Set([...DB.temas.map(t => t.nome), ...marc])];
  return `<div class="field" id="f-tm"><span class="lbl">Temas desta nota</span>
  <label class="rl"><input type="radio" name="tm" value="auto" ${modo === 'auto' ? 'checked' : ''}><span><b>Automático</b>: o app procura os temas no texto${n.id ? ` (hoje: ${atual.length ? esc(atual.join(', ')) : 'nenhum'})` : ''}</span></label>
  <label class="rl"><input type="radio" name="tm" value="manual" ${modo === 'manual' ? 'checked' : ''}><span><b>Escolher</b> eu mesmo</span></label>
  <label class="rl"><input type="radio" name="tm" value="nenhum" ${modo === 'nenhum' ? 'checked' : ''}><span><b>Nenhum</b> tema: não ligar esta nota a outras</span></label>
  <div id="tm-pick" style="display:${modo === 'manual' ? 'block' : 'none'};margin-top:8px"><div class="chips">${nomes.map(t => `<label class="chip tmck"><input type="checkbox" class="tm-c" value="${esc(t)}" ${marc.has(t) ? 'checked' : ''}>${esc(t)}</label>`).join('')}</div>
  <input class="in" id="tm-novo" style="margin-top:10px" placeholder="Outro tema novo (separe por vírgula)"></div></div>`;
}
function lerTemas() {
  const modo = ($('input[name=tm]:checked') || { value: 'auto' }).value; if (modo !== 'manual') return { temaModo: modo, temas: [] };
  const l = $$('.tm-c:checked').map(x => x.value), novos = ($('#tm-novo').value || '').split(',').map(x => x.trim()).filter(Boolean);
  novos.forEach(t => { if (!DB.temas.some(x => norm(x.nome) === norm(t))) { DB.temas.push({ id: 't' + Date.now().toString(36) + DB.temas.length, nome: t, apelidos: [] }); DB.ts.temas = now(); } });
  return { temaModo: 'manual', temas: [...new Set([...l, ...novos])] };
}
function editor(id, pref) {
  const n = id ? DB.notas.find(x => x.id === id) : Object.assign({ id: '', titulo: '', tipo: 'Nota livre', autor: '', certeza: 3, quemFalou: '', comoConfirmei: '', texto: '', tags: [], visib: 'privada', reservada: false }, pref || {});
  modal(`<h2>${id ? 'Editar nota' : 'Nova nota'}</h2><form id="fnota" data-id="${esc(id || '')}" data-vinc="${esc(pref && pref._vinc ? JSON.stringify(pref._vinc) : '')}">
  <div class="field"><label for="e-titulo">Título</label><input class="in" id="e-titulo" value="${esc(n.titulo)}" required></div>
  <div class="row2"><div class="field"><label for="e-tipo">Tipo</label><select class="in" id="e-tipo">${TIPOS.map(t => `<option ${n.tipo === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
  <div class="field"><label for="e-autor">Autor ou fonte</label><input class="in" id="e-autor" list="dl-autores" value="${esc(n.autor)}" placeholder="Quem escreveu, disse ou cantou"><datalist id="dl-autores">${autores().map(a => `<option value="${esc(a)}">`).join('')}</datalist></div></div>
  <div class="field"><span class="lbl">Grau de certeza</span><div class="czopts">${[1, 2, 3, 4].map(i => `<label class="czopt c${i}"><input type="radio" name="cz" value="${i}" ${n.certeza === i ? 'checked' : ''}><span>${ic(CZ[i].i, 18)}${CZ[i].n}</span></label>`).join('')}</div><div class="hint" id="cz-d">${CZ[n.certeza].d}</div></div>
  <div class="field" id="f-quem" style="display:${n.certeza === 2 ? 'flex' : 'none'}"><label for="e-quem">Quem me contou esta versão</label><input class="in" id="e-quem" value="${esc(n.quemFalou)}" placeholder="Nome de quem falou"><div class="hint">Cada nota guarda a versão de uma pessoa. Se ouviu de outra, crie outra nota.</div></div>
  <div class="field"><label for="e-como">Como confirmei (opcional)</label><input class="in" id="e-como" value="${esc(n.comoConfirmei)}" placeholder="Quando, onde, com quem"></div>
  ${temaBloco(n)}
  <div class="field"><label for="e-texto">Texto</label><textarea class="in" id="e-texto" rows="9" placeholder="Escreva. Use [[Tema]] para ligar a outro assunto.">${esc(n.texto)}</textarea></div>
  <div class="row2"><div class="field"><label for="e-visib">Visibilidade</label><select class="in" id="e-visib"><option value="privada" ${n.visib !== 'compartilhavel' ? 'selected' : ''}>Privada</option><option value="compartilhavel" ${n.visib === 'compartilhavel' ? 'selected' : ''}>Compartilhável (só leitura)</option></select></div>
  <div class="field"><label for="e-tags">Etiquetas</label><input class="in" id="e-tags" value="${esc((n.tags || []).join(', '))}" placeholder="separe por vírgula"><div class="chips" style="margin-top:6px">${tagsConta().slice(0, 10).map(([t]) => `<button type="button" class="chip" style="height:26px;font-size:12.5px" data-act="addtag" data-v="${esc(t)}">+ ${esc(t)}</button>`).join('')}</div></div></div>
  <label style="display:flex;gap:10px;align-items:center;font-size:14px"><input type="checkbox" id="e-res" ${n.reservada ? 'checked' : ''}> Reservada: nunca enviar ao Claude</label>
  <div class="mfoot"><button type="button" class="btn" data-act="fechar">Cancelar</button><button class="btn pri" type="submit">Salvar nota</button></div></form>`);
  setTimeout(() => $('#e-titulo') && $('#e-titulo').focus(), 30);
}
function salvarNota(f) {
  const id = f.dataset.id, g = x => $('#' + x).value.trim();
  if (!g('e-titulo')) { toast('Dê um título à nota'); return; }
  const cz = +($('input[name=cz]:checked') || { value: 3 }).value;
  const d = { titulo: g('e-titulo'), tipo: g('e-tipo'), autor: g('e-autor'), certeza: cz, quemFalou: cz === 2 ? g('e-quem') : '', comoConfirmei: g('e-como'), texto: $('#e-texto').value.trim(), visib: g('e-visib'), reservada: $('#e-res').checked, tags: g('e-tags').split(',').map(x => x.trim()).filter(Boolean), atualizado: now() }, tm = lerTemas();
  d.temaModo = tm.temaModo; if (tm.temaModo === 'manual') d.temas = tm.temas;
  let nid = id;
  if (id) Object.assign(DB.notas.find(n => n.id === id), d);
  else { nid = uid(); DB.notas.unshift(Object.assign({ id: nid, criado: now(), origem: 'app' }, d)); }
  if (id && d.temaModo !== 'manual') delete DB.notas.find(n => n.id === id).temas;
  if (!id && f.dataset.vinc) { try { const v = JSON.parse(f.dataset.vinc), it = grp(v.k, v.g).itens[v.i]; autoIdx = null; it.links = [...new Set([...notasDoItem(v.k, it).map(n => n.id), nid])]; DB.ts.catalogo = now(); } catch (e) { } }
  ncache.clear(); tcache.clear(); save(); fechar(); toast('Nota salva'); location.hash = '#/notas/' + nid; render();
}

function mtemas(id) {
  const n = DB.notas.find(x => x.id === id); if (!n) return;
  modal(`<h2>Temas de "${esc(n.titulo)}"</h2><form id="ftm" data-id="${id}">${temaBloco(n)}<div class="mfoot"><button type="button" class="btn" data-act="fechar">Cancelar</button><button class="btn pri" type="submit">Salvar</button></div></form>`);
}
function gerirTags() {
  const l = tagsConta();
  modal(`<h2>Etiquetas</h2><p class="hint" style="margin-bottom:14px">${l.length} etiquetas. Para renomear, edite o nome e saia do campo; se o nome já existir, as duas se juntam. Apagar tira a etiqueta das notas, sem apagar as notas.</p>
  <div id="tg-list">${l.map(([t, o]) => `<div class="tgrow"><input class="in tg-nome" data-old="${esc(t)}" value="${esc(t)}" aria-label="Nome da etiqueta"><span class="tgn"><b>${o.n}</b> ${o.n === 1 ? 'nota' : 'notas'} · ${o.c} confirmadas</span><button type="button" class="btn sm" data-act="tgver" data-v="${esc(t)}">Ver</button><button type="button" class="btn sm ghost dng" data-act="tgdel" data-v="${esc(t)}" aria-label="Apagar etiqueta">${ic('trash', 15)}</button></div>`).join('') || '<div class="vazio">Nenhuma etiqueta ainda. Adicione ao editar uma nota.</div>'}</div>
  <div class="mfoot"><button class="btn" data-act="fechar">Fechar</button></div>`);
}

/* =============== rede =============== */
let GRAFO = null;
function montarGrafo() {
  const tc = contaTemas().slice(0, 12), ac = {}; DB.notas.forEach(n => { if (n.autor) ac[n.autor] = (ac[n.autor] || 0) + 1; });
  const at = Object.entries(ac).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const nodes = [...tc.map(([id, c]) => ({ id, c, k: 't' })), ...at.map(([id, c]) => ({ id, c, k: 'a' }))];
  const ids = new Set(nodes.map(x => x.id)), w = {};
  DB.notas.forEach(n => { const it = temasDe(n).filter(t => ids.has(t)); if (n.autor && ids.has(n.autor)) it.push(n.autor); for (let i = 0; i < it.length; i++) for (let j = i + 1; j < it.length; j++) { const k = [it[i], it[j]].sort().join('||'); w[k] = (w[k] || 0) + 1; } });
  const edges = Object.entries(w).map(([k, v]) => { const [a, b] = k.split('||'); return { a, b, w: v }; });
  const W = 860, H = 540, N = nodes.length, kk = Math.sqrt(W * H / Math.max(N, 1));
  nodes.forEach((nd, i) => { const ang = i / N * Math.PI * 2; nd.r = Math.min(7 + Math.sqrt(nd.c) * 2.8, 30); nd.x = W / 2 + Math.cos(ang) * 260; nd.y = H / 2 + Math.sin(ang) * 190; });
  const by = Object.fromEntries(nodes.map(x => [x.id, x]));
  for (let it = 0; it < 320; it++) {
    const tmp = 36 * (1 - it / 320) + .5; nodes.forEach(x => { x.dx = 0; x.dy = 0; });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = nodes[i], b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy) || .01, f = kk * kk * 1.5 / d; dx /= d; dy /= d; a.dx += dx * f; a.dy += dy * f; b.dx -= dx * f; b.dy -= dy * f; }
    edges.forEach(e => { const a = by[e.a], b = by[e.b]; let dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy) || .01, f = d * d / kk * (.08 + Math.min(e.w, 10) * .025); dx /= d; dy /= d; a.dx -= dx * f; a.dy -= dy * f; b.dx += dx * f; b.dy += dy * f; });
    nodes.forEach(x => { x.dx += (W / 2 - x.x) * .02; x.dy += (H / 2 - x.y) * .03; const d = Math.hypot(x.dx, x.dy) || .01; x.x += x.dx / d * Math.min(d, tmp); x.y += x.dy / d * Math.min(d, tmp); });
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const a = nodes[i], b = nodes[j]; let dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy) || .01, m = a.r + b.r + 26; if (d < m) { const p = (m - d) / 2; dx /= d; dy /= d; a.x += dx * p; a.y += dy * p; b.x -= dx * p; b.y -= dy * p; } }
    nodes.forEach(x => { x.x = Math.max(70, Math.min(W - 70, x.x)); x.y = Math.max(40, Math.min(H - 44, x.y)); });
  }
  return { nodes, edges, by, W, H };
}
function vRede() {
  GRAFO = montarGrafo();
  const sel = S.node, ns = sel ? DB.notas.filter(n => (temasDe(n).includes(sel) || n.autor === sel) && (!S.rTipo || n.tipo === S.rTipo)) : [];
  const todas = sel ? DB.notas.filter(n => temasDe(n).includes(sel) || n.autor === sel) : [], by = {}; todas.forEach(n => by[n.tipo] = (by[n.tipo] || 0) + 1);
  return head('Rede', 'Toque num tema ou autor para ver onde ele aparece', `<button class="btn" data-act="temas">Gerenciar temas</button>`)
    + `<div class="card netwrap"><svg class="net" id="net" viewBox="0 0 ${GRAFO.W} ${GRAFO.H}" role="img" aria-label="Rede de temas e autores"></svg></div>
    <div class="legend" style="margin:12px 4px 0"><span><i class="sw" style="background:var(--ac)"></i>Tema</span><span><i class="sw" style="background:var(--ac2)"></i>Autor</span><span>Tamanho = quantidade de notas</span></div>
    ${sel ? `<section class="sec"><h3>${esc(sel)} · ${todas.length} notas</h3><div class="chips" style="margin-bottom:14px"><button class="chip ${!S.rTipo ? 'on' : ''}" data-act="rtipo" data-v="">Todos os tipos</button>${Object.entries(by).map(([t, c]) => `<button class="chip ${S.rTipo === t ? 'on' : ''}" data-act="rtipo" data-v="${t}">${t} <span class="n">${c}</span></button>`).join('')}</div><div class="listcol">${listaHTML(ns)}</div></section>` : `<p class="hint" style="margin-top:18px">Nenhum nó selecionado.</p>`}`;
}
function desenharRede() {
  const g = GRAFO, svg = $('#net'); if (!svg) return;
  const show = n => g.nodes.length <= 22 || n.c >= 3 || n.id === S.node;
  svg.innerHTML = g.edges.map(e => { const a = g.by[e.a], b = g.by[e.b], on = S.node && (e.a === S.node || e.b === S.node); return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${on ? 'var(--ac)' : 'var(--ln)'}" stroke-width="${on ? 2 : Math.min(1 + e.w * .4, 3)}" opacity="${on || !S.node ? 1 : .35}"/>`; }).join('')
    + g.nodes.map(n => { const r = n.r, on = n.id === S.node; return `<g class="nd" data-act="node" data-v="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(n.id)}, ${n.c} notas"><circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${n.k === 't' ? 'var(--ac)' : 'var(--ac2)'}" fill-opacity="${on ? 1 : .78}" stroke="${on ? 'var(--ink)' : 'var(--bg)'}" stroke-width="${on ? 3 : 2}"/>${show(n) ? `<text x="${n.x.toFixed(1)}" y="${(n.y + r + 14).toFixed(1)}" text-anchor="middle">${esc(n.id)}</text>` : ''}</g>`; }).join('');
}
function gerirTemas() {
  modal(`<h2>Temas</h2><p class="hint" style="margin-bottom:14px">O app procura o nome e os apelidos de cada tema no título e no texto das notas. Você também pode ligar manualmente com [[Tema]].</p>
  <form id="ftemas"><div id="tlist">${DB.temas.map((t, i) => temaRow(t, i)).join('')}</div>
  <button type="button" class="btn sm" data-act="addtema">${ic('plus', 15)} Novo tema</button>
  <div class="mfoot"><button type="button" class="btn" data-act="fechar">Cancelar</button><button class="btn pri" type="submit">Salvar temas</button></div></form>`);
}
const temaRow = (t, i) => `<div class="row2" style="margin-bottom:10px;align-items:end" data-i="${i}"><div class="field" style="margin:0"><label>Tema</label><input class="in t-nome" value="${esc(t ? t.nome : '')}"></div><div class="field" style="margin:0"><label>Apelidos, separados por vírgula</label><input class="in t-ap" value="${esc(t ? t.apelidos.join(', ') : '')}"></div></div>`;

/* =============== catálogo =============== */
function catLista() {
  const k = S.catTab, gs = DB.catalogo[k];
  if (!(k in S.open) && gs[0]) S.open[k] = { [gs[0].id]: true };
  const op = S.open[k] || {};
  return (gs.map(g => grupoHTML(k, g, !!op[g.id])).join('') || '<div class="vazio">Nada por aqui.</div>')
    + (S.catEdit ? `<div class="field" style="margin-top:18px"><label for="novo-grupo">Novo grupo</label><input class="in" id="novo-grupo" placeholder="${k === 'Chamadas' ? 'Nome do autor' : 'Nome da escala ou categoria'} e Enter"></div>` : '');
}
function vCat() {
  const k = S.catTab, s = stats(k);
  return `<div class="cfix">` + head('Catálogo', 'O que existe, e quanto você já viu ou anotou', `<button class="btn ${S.catEdit ? 'pri' : ''}" data-act="catedit">${ic('edit', 16)} ${S.catEdit ? 'Concluir edição' : 'Editar listas'}</button>`)
    + `<div class="seg" role="tablist">${['Chamadas', 'Histórias'].map(t => `<button class="${t === k ? 'on' : ''}" data-act="cattab" data-v="${t}">${t}</button>`).join('')}</div>
    <div class="card sumcard" style="margin-top:18px">${ring(k)}<div class="sumbody"><div class="lbl">Total em ${k.toLowerCase()}</div><div style="font:500 24px/1.2 var(--fnh);margin:4px 0 10px">${s.known} de ${s.tot} conhecidas</div><div class="bar"><i class="b2" style="width:${pct(s.anot, s.tot)}%"></i><i class="b1" style="width:${pct(s.vi, s.tot)}%"></i></div>${legend(s)}</div></div>
    <div style="margin-top:14px">${sbox('qc', k === 'Chamadas' ? 'Buscar chamada ou autor' : 'Buscar história ou categoria', S.cq)}</div>
    <div class="chips scroll" style="margin-top:12px">${[-1, 0, 1, 2].map(i => `<button class="chip ${S.catF === i ? 'on' : ''}" data-act="catf" data-v="${i}">${i < 0 ? 'Todos' : ST[i]}</button>`).join('')}</div></div>
    <div class="catlist" id="catlist">${catLista()}</div>`;
}
function grupoHTML(k, g, aberto) {
  const ws = norm(S.cq).split(' ').filter(Boolean), gm = ws.length && ws.every(w => norm(g.nome).includes(w));
  const s = gStats(g), its = g.itens.map((x, i) => [x, i]).filter(([x]) => (S.catF < 0 || x.s === S.catF) && (!ws.length || gm || ws.every(w => norm(x.n).includes(w))));
  if (ws.length && !its.length) return '';
  if (ws.length) aberto = true;
  return `<div class="grp ${aberto ? 'open' : ''}" data-g="${g.id}"><button class="ghead" data-act="grp" data-g="${g.id}"><span class="chev">${ic('right', 18)}</span><span class="gn">${esc(g.nome)}</span><span class="bar"><i class="b2" style="width:${pct(s.anot, s.tot)}%"></i><i class="b1" style="width:${pct(s.vi, s.tot)}%"></i></span><span class="gc">${s.known} / ${s.tot}</span></button>
  <div class="gbody">${S.catEdit ? `<div class="gedit"><div class="field" style="margin:0"><label>Nome do grupo</label><input class="in g-nome" data-g="${g.id}" value="${esc(g.nome)}"></div>
  <div class="stepper"><div><b>Ainda não listados</b><div class="hint">Existem, mas você não digitou o nome</div></div><div class="ctl"><button data-act="gextra" data-g="${g.id}" data-d="-1" aria-label="Menos">−</button><b>${g.extra || 0}</b><button data-act="gextra" data-g="${g.id}" data-d="1" aria-label="Mais">+</button></div></div>
  <input class="in g-add" data-g="${g.id}" placeholder="Adicionar item à lista e Enter"><div><button class="btn sm dng" data-act="gdel" data-g="${g.id}">${ic('trash', 15)} Excluir grupo</button></div></div>` : ''}
  ${its.map(([x, i]) => { const nts = notasDoItem(k, x); return `<div class="irow"><button class="stbtn s${x.s}" data-act="cyc" data-g="${g.id}" data-i="${i}" title="Mudar status: ${ST[x.s]}" aria-label="${esc(x.n)}: ${ST[x.s]}. Toque para mudar">${ic(ST_IC[x.s], 17)}</button><button class="iname" data-act="item" data-g="${g.id}" data-i="${i}">${esc(x.n)}</button><span class="istat">${ST[x.s]}</span>${nts.length === 1 ? `<a class="ilink" href="#/notas/${nts[0].id}">${ic('notes', 15)}Nota</a>` : nts.length > 1 ? `<button class="ilink" data-act="item" data-g="${g.id}" data-i="${i}">${ic('notes', 15)}${nts.length} notas</button>` : ''}${S.catEdit ? `<button class="btn sm ghost dng" data-act="idel" data-g="${g.id}" data-i="${i}" aria-label="Remover">${ic('x', 15)}</button>` : ''}</div>`; }).join('') || '<div class="hint" style="padding:8px 12px">Nenhum item neste filtro.</div>'}</div></div>`;
}
const grp = (k, id) => DB.catalogo[k].find(g => g.id === id);
const catTouch = () => { DB.ts.catalogo = now(); save(); };
function itemModal(k, gid, i) {
  const g = grp(k, gid), x = g.itens[i], nts = notasDoItem(k, x), dd = `data-k="${k}" data-g="${gid}" data-i="${i}"`;
  modal(`<div class="kicker">${esc(g.nome)} · ${i + 1} de ${g.itens.length}</div><h2 style="margin:8px 0 18px">${esc(x.n)}</h2>
  <div class="lbl" style="margin-bottom:8px">Status</div><div class="seg" style="display:flex">${ST.map((t, j) => `<button style="flex:1;padding:0 8px" class="${x.s === j ? 'on' : ''}" data-act="setst" ${dd} data-v="${j}">${t}</button>`).join('')}</div>
  <div class="lbl" style="margin:22px 0 4px">Notas ligadas a este item (${nts.length})</div>
  ${nts.map(nt => `<div class="lkrow"><a class="lkname" href="#/notas/${nt.id}" data-act="fechar">${esc(nt.titulo)}</a><span class="tag">${nt.tipo}</span>${czChip(nt.certeza)}<button class="btn sm ghost dng" data-act="unlink" ${dd} data-n="${nt.id}" aria-label="Tirar a ligação com esta nota" title="Tirar a ligação">${ic('x', 15)}</button></div>`).join('') || '<div class="hint" style="padding:6px 0 4px">Nenhuma nota ligada. Procure uma nota abaixo ou crie uma nova.</div>'}
  <div style="margin-top:12px"><div class="sbox"><label class="search">${ic('search', 19)}<input id="qlink" ${dd} placeholder="Ligar uma nota: digite o título ou o autor" autocomplete="off"></label><div class="sug" hidden></div></div></div>
  <div style="margin-top:14px"><button class="btn" data-act="criarnota" ${dd}>${ic('plus', 16)} Criar nota nova para este item</button></div>
  <div class="mfoot" style="justify-content:space-between"><div style="display:flex;gap:8px"><button class="btn" ${i === 0 ? 'disabled style="opacity:.4"' : ''} data-act="itnav" data-k="${k}" data-g="${gid}" data-i="${i - 1}">${ic('left', 16)} Anterior</button><button class="btn" ${i >= g.itens.length - 1 ? 'disabled style="opacity:.4"' : ''} data-act="itnav" data-k="${k}" data-g="${gid}" data-i="${i + 1}">Próxima ${ic('right', 16)}</button></div><button class="btn" data-act="fechar">Fechar</button></div>`);
}

/* =============== configurações, backup e sincronização =============== */
function baixar(nome, txt, tipo) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: tipo })); a.download = nome; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
function paraClaude(soCompart) {
  const l = DB.notas.filter(n => !n.reservada && (!soCompart || n.visib === 'compartilhavel'));
  return `# Lume Guia: minhas notas\n\nNotas: ${l.length}. Graus de certeza: Confirmado, Ouvi de alguém (com o nome de quem contou), Memória e Dúvida. Ao responder, cite a nota e diga o grau de certeza.\n\n` + l.map(n => `## ${n.titulo}\n- Tipo: ${n.tipo}\n- Autor: ${n.autor || 'desconhecido'}\n- Certeza: ${CZ[n.certeza].n}${n.certeza === 2 && n.quemFalou ? ' (versão de ' + n.quemFalou + ')' : ''}${n.comoConfirmei ? '\n- Como confirmei: ' + n.comoConfirmei : ''}\n\n${n.texto}\n`).join('\n');
}
const semSegredos = () => { const c = JSON.parse(JSON.stringify(DB)); c.cfg.sync.token = ''; return c; };
function vConfig() {
  const c = DB.cfg, sy = c.sync;
  return head('Configurações', 'Aparência, dados e sincronização')
    + `<section class="sec" style="margin-top:0"><h3>Estilo</h3><div class="opts">${ESTILOS.map(([k, n, d]) => `<button class="opt ${c.estilo === k ? 'on' : ''}" data-act="estilo" data-v="${k}"><b>${n}</b><span>${d}</span></button>`).join('')}</div></section>
    <section class="sec"><h3>Tema</h3><div class="seg"><button class="${c.escuro ? 'on' : ''}" data-act="escuro" data-v="1">Escuro</button><button class="${!c.escuro ? 'on' : ''}" data-act="escuro" data-v="0">Claro</button></div></section>
    <section class="sec"><h3>Leitura e tela</h3><div class="card">
      <div class="cfgrow"><span class="lbl">Tamanho da interface (telas grandes ficam maiores sozinhas)</span><div class="seg wrap">${[['auto', 'Automático'], [.9, '90%'], [1, '100%'], [1.1, '110%'], [1.25, '125%'], [1.4, '140%']].map(([v, n]) => `<button class="${String(c.esc) === String(v) ? 'on' : ''}" data-act="cfg" data-k="esc" data-v="${v}">${n}</button>`).join('')}</div></div>
      <div class="cfgrow"><span class="lbl">Tamanho da letra das notas</span><div class="seg wrap">${[[.9, 'Pequena'], [1, 'Média'], [1.15, 'Grande'], [1.3, 'Muito grande']].map(([v, n]) => `<button class="${+c.txt === v ? 'on' : ''}" data-act="cfg" data-k="txt" data-v="${v}">${n}</button>`).join('')}</div></div>
      <div class="cfgrow"><span class="lbl">Contraste do texto</span><div class="seg wrap">${['Normal', 'Alto', 'Máximo'].map((n, i) => `<button class="${c.contr === i ? 'on' : ''}" data-act="cfg" data-k="contr" data-v="${i}">${n}</button>`).join('')}</div></div>
      <div class="cfgrow"><span class="lbl">Letra das notas</span><div class="seg wrap"><button class="${c.fonte !== 'sans' ? 'on' : ''}" data-act="cfg" data-k="fonte" data-v="serif">Com serifa</button><button class="${c.fonte === 'sans' ? 'on' : ''}" data-act="cfg" data-k="fonte" data-v="sans">Sem serifa</button></div></div>
      <div class="cfgrow"><label class="lbl" for="r-cx">Opacidade das caixas (estilo Vidro líquido)</label><div class="rng"><input type="range" id="r-cx" min="40" max="100" step="2" value="${c.caixa}"><b id="r-cxv">${c.caixa}%</b></div><span class="hint">Mais alto = fundo da caixa mais sólido e texto mais fácil de ler.</span></div>
      <div class="cfgrow"><span class="lbl">Prévia</span><div class="card" style="box-shadow:none"><div class="prose" style="white-space:normal">Texto de exemplo de uma nota, para você conferir o tamanho e o contraste da letra. <span class="lk">Tema ligado</span></div><p class="ns" style="margin-top:8px;-webkit-line-clamp:unset">Texto secundário, como o resumo de uma nota na lista.</p></div></div>
    </div></section>
    <section class="sec"><h3>Paleta · ${PAL[c.paleta][0]}</h3><div class="pals">${PAL.map((p, i) => `<button class="pal ${c.paleta === i ? 'on' : ''}" data-act="paleta" data-v="${i}" aria-label="${p[0]}"><i style="background:linear-gradient(90deg,${(c.escuro ? p[2] : p[1])[5]},${(c.escuro ? p[2] : p[1])[6]})"></i>${p[0]}</button>`).join('')}</div></section>
    <section class="sec"><h3>Conversar com o Claude</h3><div class="card"><p style="margin-bottom:12px">Gera um arquivo com as suas notas, sem as marcadas como reservadas. Anexe no Claude e pergunte à vontade. O app não envia nada sozinho.</p><div class="chips"><button class="btn pri" data-act="exclaude" data-v="0">${ic('down', 16)} Todas as notas</button><button class="btn" data-act="exclaude" data-v="1">${ic('down', 16)} Só compartilháveis</button></div></div></section>
    <section class="sec"><h3>Dados</h3><div class="card"><div class="chips"><button class="btn" data-act="backup">${ic('down', 16)} Baixar backup</button><label class="btn" style="cursor:pointer">${ic('up', 16)} Restaurar backup<input type="file" accept=".json" id="f-backup" hidden></label><button class="btn" data-act="mtags">Gerenciar etiquetas</button><label class="btn" style="cursor:pointer">${ic('up', 16)} Importar do Evernote (.enex)<input type="file" accept=".enex" id="f-enex" hidden multiple></label></div><p class="hint" style="margin-top:12px">${DB.notas.length} notas e ${stats('Chamadas').tot + stats('Histórias').tot} itens de catálogo neste aparelho.</p></div></section>
    <section class="sec"><h3>Sincronização com o GitHub</h3><div class="card"><p class="hint" style="margin-bottom:14px">Guarda um arquivo no seu repositório privado e mantém seus aparelhos iguais. A chave fica só neste aparelho.</p>
    <div class="row2"><div class="field"><label for="s-repo">Repositório (dono/nome)</label><input class="in" id="s-repo" value="${esc(sy.repo)}" placeholder="seu-usuario/cerebro-notas"></div><div class="field"><label for="s-branch">Ramo</label><input class="in" id="s-branch" value="${esc(sy.branch)}"></div></div>
    <div class="field"><label for="s-token">Chave de acesso (token)</label><input class="in mono" id="s-token" type="password" value="${esc(sy.token)}" placeholder="github_pat_..." autocomplete="off"></div>
    <div class="cfgrow"><span class="lbl">Sincronizar sozinho (ao abrir, ao voltar ao app e uns 20 segundos depois de editar)</span><div class="seg wrap"><button class="${c.auto ? 'on' : ''}" data-act="cfg" data-k="auto" data-v="1">Ligado</button><button class="${!c.auto ? 'on' : ''}" data-act="cfg" data-k="auto" data-v="0">Desligado</button></div></div>
    <div class="chips"><button class="btn pri" data-act="sync">${ic('sync', 16)} Sincronizar agora</button></div><p class="hint" id="syncmsg" style="margin-top:10px">${esc(S.syncMsg || (sy.ultima ? 'Última sincronização: ' + fmtD(sy.ultima) : 'Ainda não sincronizado.'))}</p></div></section>
    <section class="sec"><h3>Zona de risco</h3><button class="btn dng" data-act="reset">Apagar tudo e recomeçar</button></section>`;
}
function mergeDB(L, R) {
  if (!R || !Array.isArray(R.notas)) return L;
  const ap = Object.assign({}, R.apagadas || {}, L.apagadas || {}), m = new Map();
  [...R.notas, ...L.notas].forEach(n => { const o = m.get(n.id); if (!o || (n.atualizado || '') > (o.atualizado || '')) m.set(n.id, n); });
  const notas = [...m.values()].filter(n => !(ap[n.id] && ap[n.id] >= (n.atualizado || '')));
  const pick = (k, campo) => (R.ts && R.ts[k] || '') > (L.ts[k] || '') ? R[campo] : L[campo];
  return Object.assign(L, { notas, apagadas: ap, catalogo: pick('catalogo', 'catalogo'), temas: pick('temas', 'temas'), ts: { catalogo: (R.ts && R.ts.catalogo || '') > L.ts.catalogo ? R.ts.catalogo : L.ts.catalogo, temas: (R.ts && R.ts.temas || '') > L.ts.temas ? R.ts.temas : L.ts.temas } });
}
const b64 = s => btoa(unescape(encodeURIComponent(s)));
const unb64 = s => decodeURIComponent(escape(atob(s.replace(/\s/g, ''))));
const horaAgora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const assinatura = () => JSON.stringify([DB.notas, DB.catalogo, DB.temas]).length;
let autoT = 0;
function agendarSync(ms = 20000) {
  if (!DB || !DB.cfg.auto || S.busy) return;
  const sy = DB.cfg.sync; if (!sy.repo || !sy.token || !navigator.onLine) return;
  clearTimeout(autoT); autoT = setTimeout(() => sincronizar(true), ms);
}
async function sincronizar(auto) {
  if (S.busy) return;
  const sy = DB.cfg.sync;
  if (!auto) { const g = id => { const e = $('#' + id); return e ? e.value.trim() : null; }, r = g('s-repo'), b = g('s-branch'), t = g('s-token'); if (r !== null) sy.repo = r; if (b !== null) sy.branch = b || 'main'; if (t !== null) sy.token = t; save(); }
  const say = m => { S.syncMsg = m; const e = $('#syncmsg'); if (e) e.textContent = m; const f = $('#sfstat'); if (f) f.textContent = m; };
  if (!/^[\w.-]+\/[\w.-]+$/.test(sy.repo) || !sy.token) { if (!auto) say('Preencha o repositório (dono/nome) e a chave.'); return; }
  const url = `https://api.github.com/repos/${sy.repo}/contents/${sy.path}`, h = { Authorization: 'Bearer ' + sy.token, Accept: 'application/vnd.github+json' };
  S.busy = true; clearTimeout(autoT);
  try {
    say(auto ? 'Sincronizando…' : 'Conectando…');
    const antes = assinatura(); let ok = false;
    for (let tent = 0; tent < 2 && !ok; tent++) {
      const r = await fetch(`${url}?ref=${encodeURIComponent(sy.branch)}`, { headers: h }); let sha;
      if (r.status === 200) { const j = await r.json(); sha = j.sha; DB = Object.assign(mergeDB(DB, JSON.parse(unb64(j.content || ''))), { cfg: DB.cfg }); }
      else if (r.status !== 404) throw new Error(r.status === 401 ? 'chave inválida ou sem permissão' : r.status === 403 ? 'chave sem permissão de escrita' : 'erro ' + r.status);
      const p = await fetch(url, { method: 'PUT', headers: h, body: JSON.stringify({ message: 'Lume Guia: sincronização ' + now(), content: b64(JSON.stringify(Object.assign(semSegredos(), { cfg: undefined }))), branch: sy.branch, sha }) });
      if (p.ok) { ok = true; break; }
      if ((p.status === 409 || p.status === 422) && tent === 0) continue;
      throw new Error(p.status === 404 ? 'repositório não encontrado' : p.status === 409 || p.status === 422 ? 'conflito, tente de novo' : 'erro ao enviar ' + p.status);
    }
    DB.cfg.sync.ultima = now(); save(); S.ult = Date.now();
    const mudou = assinatura() !== antes;
    ncache.clear(); tcache.clear(); say('Sincronizado às ' + horaAgora());
    if (!auto || mudou) { const ocupado = $('#modal').innerHTML.trim() || /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || ''); if (auto && ocupado) S.pendRender = true; else render(); }
  } catch (e) { say('Não sincronizou: ' + (e.message || e)); if (auto) setTimeout(() => agendarSync(0), 120000); }
  finally { S.busy = false; }
}
async function lerEnex(files) {
  let add = 0;
  for (const f of files) {
    const doc = new DOMParser().parseFromString(await f.text(), 'text/xml');
    $$('note', doc).forEach(nt => {
      const titulo = ($('title', nt) || {}).textContent || 'Sem título'; if (/^lista (de )?(chamadas|hist)/i.test(titulo)) return;
      const cr = (($('created', nt) || {}).textContent || '').replace(/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z$/, '$1-$2-$3T$4:$5:$6Z');
      if (DB.notas.some(n => norm(n.titulo) === norm(titulo) && n.criado === cr)) return;
      const html = new DOMParser().parseFromString((($('content', nt) || {}).textContent || ''), 'text/html'), out = [];
      (function w(el) { el.childNodes.forEach(c => { if (c.nodeType === 3) out.push(c.nodeValue); else if (c.nodeType === 1) { const t = c.tagName.toLowerCase(); if (/display:\s*none/.test(c.getAttribute('style') || '')) return; if (t === 'br') out.push('\n'); else if (t === 'en-todo') out.push(c.getAttribute('checked') === 'true' ? '[x] ' : '[ ] '); else { const blk = /^(div|p|li|h\d|tr)$/.test(t); if (t === 'li') out.push('\n• '); else if (blk) out.push('\n'); w(c); if (blk && t !== 'li') out.push('\n'); } } }); })(html.body);
      const tags = $$('tag', nt).map(x => x.textContent), autor = tags.find(t => !/^(✓✓)$/.test(t)) || '';
      const ch = DB.catalogo.Chamadas.some(g => g.itens.some(i => norm(i.n) === norm(titulo))), hi = DB.catalogo['Histórias'].some(g => g.itens.some(i => norm(i.n) === norm(titulo)));
      DB.notas.push({ id: uid(), titulo, texto: out.join('').replace(/ /g, ' ').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim(), tags: tags.filter(t => t !== autor), autor: autor, criado: cr || now(), atualizado: now(), tipo: ch ? 'Chamada' : hi ? 'História' : 'Nota livre', certeza: 3, quemFalou: '', comoConfirmei: '', visib: 'privada', reservada: false, origem: 'evernote' });
      add++;
    });
  }
  ncache.clear(); tcache.clear(); save(); toast(add + ' notas importadas'); render();
}

/* =============== eventos =============== */
const ACT = {
  nova: () => editor(),
  editar: d => editor(d.id),
  apagar: d => modal(`<h2>Excluir nota?</h2><p>Esta ação não pode ser desfeita.</p><div class="mfoot"><button class="btn" data-act="fechar">Cancelar</button><button class="btn pri" data-act="apagar2" data-id="${d.id}">Excluir</button></div>`),
  apagar2: d => { DB.notas = DB.notas.filter(n => n.id !== d.id); DB.apagadas[d.id] = now(); save(); fechar(); toast('Nota excluída'); location.hash = '#/notas'; render(); },
  fechar: () => fechar(), fundo: (d, e) => { if (e.target.classList.contains('modal')) fechar(); },
  voltar: () => { location.hash = '#/notas'; },
  tema: d => { S.tema = d.v; S.tipo = ''; S.cz = 0; S.autor = ''; S.tag = ''; S.q = ''; location.hash = '#/notas'; render(); },
  ftipo: d => { S.tipo = d.v; render(); }, fcz: d => { S.cz = +d.v; render(); },
  node: d => { S.node = d.v === S.node ? '' : d.v; S.rTipo = ''; render(); }, rtipo: d => { S.rTipo = d.v; render(); },
  temas: () => gerirTemas(), addtema: () => $('#tlist').insertAdjacentHTML('beforeend', temaRow(null, -1)),
  cat: d => { S.catTab = d.k; },
  cattab: d => { S.catTab = d.v; S.catF = -1; render(); }, catf: d => { S.catF = +d.v; render(); },
  catedit: () => { S.catEdit = !S.catEdit; render(); },
  grp: d => { const o = S.open[S.catTab] = S.open[S.catTab] || {}; o[d.g] = !o[d.g]; render(); },
  cyc: d => { const x = grp(S.catTab, d.g).itens[+d.i]; x.s = (x.s + 1) % 3; catTouch(); const y = $('#main').scrollTop; render(); $('#main').scrollTop = y; },
  item: d => itemModal(S.catTab, d.g, +d.i),
  itnav: d => itemModal(d.k, d.g, +d.i),
  setst: d => { grp(d.k, d.g).itens[+d.i].s = +d.v; catTouch(); itemModal(d.k, d.g, +d.i); const y = $('#main').scrollTop; render(); $('#main').scrollTop = y; },
  criarnota: d => { const g = grp(d.k, d.g), x = g.itens[+d.i]; editor(null, { titulo: x.n, tipo: d.k === 'Chamadas' ? 'Chamada' : 'História', autor: d.k === 'Chamadas' ? g.nome : '', certeza: 3, _vinc: { k: d.k, g: d.g, i: +d.i } }); },
  dolink: d => { const it = grp(d.k, d.g).itens[+d.i], ids = notasDoItem(d.k, it).map(n => n.id); if (!ids.includes(d.n)) ids.push(d.n); it.links = ids; catTouch(); render(); itemModal(d.k, d.g, +d.i); },
  unlink: d => { const it = grp(d.k, d.g).itens[+d.i]; it.links = notasDoItem(d.k, it).map(n => n.id).filter(x => x !== d.n); catTouch(); render(); itemModal(d.k, d.g, +d.i); },
  mtags: () => gerirTags(), mtemas: d => mtemas(d.id),
  addtag: d => { const e = $('#e-tags'); if (!e) return; const l = e.value.split(',').map(x => x.trim()).filter(Boolean); if (!l.includes(d.v)) l.push(d.v); e.value = l.join(', '); },
  tgver: d => { S.tipo = ''; S.cz = 0; S.autor = ''; S.tema = ''; S.q = ''; S.tag = d.v; fechar(); location.hash = '#/notas'; render(); },
  tgdel: d => { const c = (tagsConta().find(x => x[0] === d.v) || [0, { n: 0 }])[1].n; modal(`<h2>Apagar a etiqueta "${esc(d.v)}"?</h2><p>Ela sai de ${c} ${c === 1 ? 'nota' : 'notas'}. As notas continuam, só perdem a etiqueta.</p><div class="mfoot"><button class="btn" data-act="mtags">Cancelar</button><button class="btn pri" data-act="tgdel2" data-v="${esc(d.v)}">Apagar etiqueta</button></div>`); },
  tgdel2: d => { DB.notas.forEach(n => { if ((n.tags || []).includes(d.v)) { n.tags = n.tags.filter(x => x !== d.v); n.atualizado = now(); } }); if (S.tag === d.v) S.tag = ''; ncache.clear(); save(); toast('Etiqueta apagada'); gerirTags(); render(); },
  sugnota: d => { fecharSug(); location.hash = '#/notas/' + d.v; },
  sugfiltro: d => { S.tipo = ''; S.cz = 0; S.autor = ''; S.tema = ''; S.tag = ''; S.q = ''; S[d.t] = d.v; location.hash = '#/notas'; render(); },
  sugcat: d => { S.cq = d.v; const i = $('#qc'); if (i) i.value = d.v; const l = $('#catlist'); if (l) l.innerHTML = catLista(); fecharSug(); },
  gextra: d => { const g = grp(S.catTab, d.g); g.extra = Math.max(0, (g.extra || 0) + +d.d); catTouch(); render(); },
  gdel: d => { const g = grp(S.catTab, d.g); modal(`<h2>Excluir "${esc(g.nome)}"?</h2><p>Os ${g.itens.length} itens deste grupo saem do catálogo.</p><div class="mfoot"><button class="btn" data-act="fechar">Cancelar</button><button class="btn pri" data-act="gdel2" data-g="${g.id}">Excluir grupo</button></div>`); },
  gdel2: d => { DB.catalogo[S.catTab] = DB.catalogo[S.catTab].filter(g => g.id !== d.g); catTouch(); fechar(); render(); },
  idel: d => { const x = grp(S.catTab, d.g).itens[+d.i]; modal(`<h2>Remover da lista?</h2><p>"${esc(x.n)}" sai do catálogo. As notas ligadas a ele continuam existindo.</p><div class="mfoot"><button class="btn" data-act="fechar">Cancelar</button><button class="btn pri" data-act="idel2" data-g="${d.g}" data-i="${d.i}">Remover</button></div>`); },
  idel2: d => { grp(S.catTab, d.g).itens.splice(+d.i, 1); catTouch(); fechar(); toast('Item removido'); render(); },
  cfg: d => { const k = d.k; DB.cfg[k] = (k === 'fonte' || (k === 'esc' && d.v === 'auto')) ? d.v : +d.v; save(); aplicar(); render(); },
  estilo: d => { DB.cfg.estilo = d.v; save(); aplicar(); render(); },
  escuro: d => { DB.cfg.escuro = d.v === '1'; save(); aplicar(); render(); },
  paleta: d => { DB.cfg.paleta = +d.v; save(); aplicar(); render(); },
  exclaude: d => { baixar('lume-guia-para-claude.md', paraClaude(d.v === '1'), 'text/markdown'); toast('Arquivo gerado'); },
  backup: () => { baixar('lume-guia-backup-' + now().slice(0, 10) + '.json', JSON.stringify(semSegredos()), 'application/json'); },
  sync: () => sincronizar(false),
  reset: () => modal(`<h2>Apagar tudo?</h2><p>Apaga as notas e o catálogo deste aparelho e volta ao conteúdo importado do Evernote. Baixe um backup antes.</p><div class="mfoot"><button class="btn" data-act="fechar">Cancelar</button><button class="btn pri" data-act="reset2">Apagar e recomeçar</button></div>`),
  reset2: () => { localStorage.removeItem(KEY); location.reload(); }
};
document.addEventListener('click', e => { if (!e.target.closest('.sbox')) fecharSug(); const t = e.target.closest('[data-act]'); if (!t) return; const f = ACT[t.dataset.act]; if (!f) return; if (t.tagName === 'A' && t.dataset.act !== 'cat' && t.dataset.act !== 'fechar') return; f(t.dataset, e); });
document.addEventListener('keydown', e => {
  const sb = e.target.closest && e.target.closest('.sbox'), sg = sb && $('.sug', sb);
  if (sg && !sg.hidden) {
    const its = $$('button', sg), ix = its.findIndex(b => b.classList.contains('on'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const n = e.key === 'ArrowDown' ? (ix + 1) % its.length : (ix <= 0 ? its.length - 1 : ix - 1); its.forEach((b, j) => b.classList.toggle('on', j === n)); its[n].scrollIntoView({ block: 'nearest' }); return; }
    if (e.key === 'Enter' && ix >= 0) { e.preventDefault(); its[ix].click(); return; }
    if (e.key === 'Escape') { sg.hidden = true; return; }
  }
  if (e.key === 'Escape') fechar();
  if (e.key === 'Enter' && e.target.id === 'qhome') { S.q = e.target.value; S.tipo = ''; S.cz = 0; S.tema = ''; S.tag = ''; S.autor = ''; location.hash = '#/notas'; render(); }
  if (e.key === 'Enter' && e.target.id === 'novo-grupo' && e.target.value.trim()) { const k = S.catTab; DB.catalogo[k].push({ id: k.slice(0, 2) + Date.now().toString(36), nome: e.target.value.trim(), extra: 0, itens: [] }); catTouch(); render(); }
  if (e.key === 'Enter' && e.target.classList.contains('g-add') && e.target.value.trim()) { e.preventDefault(); grp(S.catTab, e.target.dataset.g).itens.push({ n: e.target.value.trim(), s: 0 }); catTouch(); const y = $('#main').scrollTop, g = e.target.dataset.g; render(); $('#main').scrollTop = y; const i = $(`.g-add[data-g="${g}"]`); i && i.focus(); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('nd')) { e.preventDefault(); ACT.node(e.target.dataset); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'r-cx') { DB.cfg.caixa = +e.target.value; $('#r-cxv').textContent = e.target.value + '%'; save(); aplicar(); }
  if (e.target.id === 'qn') { S.q = e.target.value; clearTimeout(input.t); input.t = setTimeout(() => { const l = filtrar(), r = route(); $('#nlist').innerHTML = listaHTML(l, r.a); $('#ncount').textContent = l.length + ' de ' + DB.notas.length; $('#fchips').innerHTML = facetas(); }, 120); }
  if (e.target.id === 'qc') { S.cq = e.target.value; clearTimeout(input.t); input.t = setTimeout(() => { $('#catlist').innerHTML = catLista(); }, 120); }
  const cx = ctxDe(e.target.id); if (cx) mostrarSug(e.target, cx);
});
document.addEventListener('focusin', e => { if (!e.target.closest('.sbox')) fecharSug(); else { const cx = ctxDe(e.target.id); if (cx && e.target.value) mostrarSug(e.target, cx); } });
function input() { }
document.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'fautor') { S.autor = t.value; render(); } else if (t.id === 'ftema') { S.tema = t.value; render(); } else if (t.id === 'ftag') { S.tag = t.value; render(); }
  else if (t.name === 'tm') { $('#tm-pick').style.display = t.value === 'manual' ? 'block' : 'none'; }
  else if (t.classList.contains('tg-nome')) { const old = t.dataset.old, nv = t.value.trim(); if (!nv || nv === old) { t.value = old; return; } DB.notas.forEach(n => { if ((n.tags || []).includes(old)) { n.tags = [...new Set(n.tags.map(x => x === old ? nv : x))]; n.atualizado = now(); } }); if (S.tag === old) S.tag = nv; ncache.clear(); save(); toast('Etiqueta renomeada'); gerirTags(); render(); } else if (t.id === 'ford') { S.ord = t.value; render(); }
  else if (t.name === 'cz') { const v = +t.value; $('#f-quem').style.display = v === 2 ? 'flex' : 'none'; $('#cz-d').textContent = CZ[v].d; }
  else if (t.classList.contains('g-nome')) { grp(S.catTab, t.dataset.g).nome = t.value.trim() || 'Sem nome'; catTouch(); }
  else if (t.id === 'f-backup' && t.files[0]) t.files[0].text().then(x => { try { const d = JSON.parse(x); if (!Array.isArray(d.notas)) throw 0; d.cfg = DB.cfg; DB = d; ncache.clear(); tcache.clear(); save(); aplicar(); toast('Backup restaurado'); render(); } catch (er) { toast('Arquivo de backup inválido'); } });
  else if (t.id === 'f-enex' && t.files.length) lerEnex([...t.files]);
});
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id === 'fnota') salvarNota(e.target);
  if (e.target.id === 'ftm') { const n = DB.notas.find(x => x.id === e.target.dataset.id), tm = lerTemas(); n.temaModo = tm.temaModo; if (tm.temaModo === 'manual') n.temas = tm.temas; else delete n.temas; n.atualizado = now(); ncache.clear(); tcache.clear(); save(); fechar(); toast('Temas salvos'); render(); }
  if (e.target.id === 'ftemas') {
    const l = $$('#tlist [data-i]').map((r, i) => ({ id: 't' + Date.now().toString(36) + i, nome: $('.t-nome', r).value.trim(), apelidos: $('.t-ap', r).value.split(',').map(x => x.trim()).filter(Boolean) })).filter(t => t.nome);
    DB.temas = l; DB.ts.temas = now(); tcache.clear(); save(); fechar(); toast('Temas salvos'); render();
  }
});
window.addEventListener('online', () => { render(); agendarSync(1500); }); window.addEventListener('offline', render);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && DB && Date.now() - (S.ult || 0) > 60000) agendarSync(1500); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
boot();
})();
