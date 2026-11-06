// 로드맵 로직 (UI 없음) — 브라우저와 Node 테스트 공용
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Roadmap = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const STATUSES = ['계획', '진행 중', '완료', '보류'];
  const LEVELS = { 1: '입문', 2: '중급', 3: '고급' };

  // 기본 데이터 + 사용자가 추가한 항목 (같은 id면 사용자 항목이 우선)
  function mergeItems(base, custom) {
    const m = new Map(base.map(i => [i.id, i]));
    (custom || []).forEach(i => m.set(i.id, { ...i, custom: true }));
    return [...m.values()];
  }

  function filter(items, f = {}) {
    const q = (f.q || '').toLowerCase().trim();
    return items.filter(i =>
      (!f.kind || i.kind === f.kind) &&
      (!f.level || i.level === Number(f.level)) &&
      (!f.provider || i.provider === f.provider) &&
      (!f.freeOnly || i.free === true) &&
      (!q || [i.name, i.provider, ...(i.topics || [])].join(' ').toLowerCase().includes(q)));
  }

  function providers(items) {
    return [...new Set(items.map(i => i.provider))].sort((a, b) => a.localeCompare(b, 'ko'));
  }

  function clampProgress(v) {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
  }

  // plan: { [itemId]: { status, progress, target, memo, updated } }
  function setPlan(plan, id, patch, now = Date.now()) {
    const cur = plan[id] || { status: '계획', progress: 0, target: '', memo: '' };
    const next = { ...cur, ...patch, updated: now };
    if (!STATUSES.includes(next.status)) next.status = cur.status;
    next.progress = clampProgress(next.progress);
    if (patch.status === '완료') next.progress = 100;
    else if (next.progress === 100 && patch.progress !== undefined && cur.status !== '완료') next.status = '완료';
    return { ...plan, [id]: next };
  }

  function removePlan(plan, id) {
    const { [id]: _, ...rest } = plan;
    return rest;
  }

  function daysLeft(target, today = new Date()) {
    if (!target || !/^\d{4}-\d{2}-\d{2}$/.test(target)) return null;
    const t = Date.UTC(+target.slice(0, 4), +target.slice(5, 7) - 1, +target.slice(8, 10));
    const d = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((t - d) / 86400000);
  }

  function summary(plan, items) {
    const ids = Object.keys(plan).filter(id => items.some(i => i.id === id));
    const by = Object.fromEntries(STATUSES.map(s => [s, 0]));
    ids.forEach(id => by[plan[id].status]++);
    const active = ids.filter(id => plan[id].status !== '보류');
    const avg = active.length ? Math.round(active.reduce((a, id) => a + plan[id].progress, 0) / active.length) : 0;
    return { total: ids.length, byStatus: by, avgProgress: avg };
  }

  function validateCustom(item) {
    const errors = [];
    if (!item.name || !String(item.name).trim()) errors.push('이름을 입력하세요');
    if (!['cert', 'course'].includes(item.kind)) errors.push('종류가 올바르지 않습니다');
    if (![1, 2, 3].includes(Number(item.level))) errors.push('난이도가 올바르지 않습니다');
    if (item.url && !/^https?:\/\//i.test(item.url)) errors.push('링크는 http(s)로 시작해야 합니다');
    return errors;
  }

  function exportState(state) {
    return JSON.stringify({ app: 'ai-certification-roadmap', version: 1, ...state }, null, 2);
  }

  function importState(json) {
    let d;
    try { d = JSON.parse(json); } catch (e) { throw new Error('JSON 형식이 아닙니다'); }
    if (!d || d.app !== 'ai-certification-roadmap') throw new Error('이 앱의 백업 파일이 아닙니다');
    const plan = {};
    for (const [id, p] of Object.entries(d.plan || {})) {
      if (!p || typeof p !== 'object') continue;
      plan[id] = {
        status: STATUSES.includes(p.status) ? p.status : '계획',
        progress: clampProgress(p.progress), target: String(p.target || ''), memo: String(p.memo || ''),
        updated: Number(p.updated) || Date.now(),
      };
    }
    const custom = (Array.isArray(d.custom) ? d.custom : []).filter(i => i && i.id && validateCustom(i).length === 0);
    return { plan, custom };
  }

  return { STATUSES, LEVELS, mergeItems, filter, providers, setPlan, removePlan, daysLeft, summary, validateCustom, exportState, importState, clampProgress };
});
