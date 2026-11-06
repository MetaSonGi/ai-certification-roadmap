(function () {
  'use strict';
  const R = window.Roadmap;
  const KEY = 'ai-cert-roadmap.v1';
  const $ = id => document.getElementById(id);
  let state = load();
  let items = R.mergeItems(window.ROADMAP_DATA, state.custom);

  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); return { plan: s.plan || {}, custom: s.custom || [] }; }
    catch (e) { return { plan: {}, custom: [] }; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 저장 불가 환경 */ } }
  function h(tag, attrs = {}, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
    }
    kids.flat().forEach(c => c != null && e.append(c));
    return e;
  }

  function renderSummary() {
    const s = R.summary(state.plan, items);
    const el = $('summary'); el.textContent = '';
    [['로드맵 항목', s.total], ['진행 중', s.byStatus['진행 중']], ['완료', s.byStatus['완료']], ['평균 진행률', s.avgProgress + '%']]
      .forEach(([k, v]) => el.append(h('div', { class: 'stat' }, h('b', {}, String(v)), k)));
  }

  function renderProviders() {
    const sel = $('provider'); const cur = sel.value;
    sel.length = 1;
    R.providers(items).forEach(p => sel.append(h('option', { value: p }, p)));
    sel.value = cur;
  }

  function renderCards() {
    const list = R.filter(items, { q: $('q').value, kind: $('kind').value, level: $('level').value, provider: $('provider').value, freeOnly: $('freeOnly').checked });
    $('count').textContent = `${list.length}개 항목`;
    const box = $('cards'); box.textContent = '';
    if (!list.length) { box.append(h('div', { class: 'empty' }, '조건에 맞는 항목이 없습니다')); return; }
    for (const i of list) {
      const inPlan = !!state.plan[i.id];
      box.append(h('article', { class: 'card' },
        h('h3', {}, i.name),
        h('div', { class: 'meta' },
          h('span', { class: 'chip k-' + i.kind }, i.kind === 'cert' ? '자격증' : (i.free ? '무료 교육' : '교육')),
          h('span', { class: 'chip' }, R.LEVELS[i.level] || ''),
          h('span', { class: 'chip' }, i.provider || '기관 미상'),
          i.custom ? h('span', { class: 'chip' }, '직접 추가') : null),
        h('div', { class: 'muted' }, [(i.topics || []).join(' · '), i.lang ? ' / ' + i.lang : ''].join('')),
        h('div', { class: 'actions' },
          h('button', { class: inPlan ? '' : 'primary', 'data-id': i.id, onclick: () => togglePlan(i.id) }, inPlan ? '로드맵에서 빼기' : '로드맵에 추가'),
          i.url ? h('a', { href: i.url, target: '_blank', rel: 'noopener noreferrer' }, '공식 링크 ↗') : null)));
    }
  }

  function togglePlan(id) {
    state.plan = state.plan[id] ? R.removePlan(state.plan, id) : R.setPlan(state.plan, id, {});
    save(); renderAll();
  }

  function renderPlan() {
    const box = $('plan'); box.textContent = '';
    const ids = Object.keys(state.plan).filter(id => items.some(i => i.id === id))
      .sort((a, b) => R.STATUSES.indexOf(state.plan[a].status) - R.STATUSES.indexOf(state.plan[b].status));
    if (!ids.length) { box.append(h('div', { class: 'empty' }, '비교하기 탭에서 "로드맵에 추가"를 눌러 학습 계획을 만드세요')); return; }
    for (const id of ids) {
      const i = items.find(x => x.id === id); const p = state.plan[id];
      const dl = R.daysLeft(p.target);
      const upd = patch => { state.plan = R.setPlan(state.plan, id, patch); save(); renderSummary(); renderPlan(); };
      box.append(h('div', { class: 'planrow', 'data-id': id },
        h('h3', {}, i.name),
        h('span', { class: 'muted' }, p.progress + '%'),
        h('div', { class: 'bar' }, h('i', { style: `width:${p.progress}%` })),
        h('div', { class: 'ctrl' },
          h('select', { 'aria-label': '상태', onchange: e => upd({ status: e.target.value }) },
            R.STATUSES.map(s => h('option', { value: s, selected: s === p.status }, s))),
          h('input', { type: 'range', min: 0, max: 100, step: 5, value: p.progress, 'aria-label': '진행률', onchange: e => upd({ progress: e.target.value }) }),
          h('label', { class: 'chk' }, '목표일', h('input', { type: 'date', value: p.target, onchange: e => upd({ target: e.target.value }) })),
          dl == null ? null : h('span', { class: 'due' + (dl < 0 && p.status !== '완료' ? ' over' : '') }, dl >= 0 ? `D-${dl}` : `${-dl}일 지남`),
          h('button', { onclick: () => togglePlan(id) }, '빼기')),
        h('textarea', { placeholder: '메모 (교재, 시험 일정, 약점 등)', 'aria-label': '메모', onchange: e => upd({ memo: e.target.value }) }, p.memo)));
    }
  }

  function renderAll() { renderSummary(); renderProviders(); renderCards(); renderPlan(); }

  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    ['browse', 'plan', 'add'].forEach(t => { $('tab-' + t).hidden = t !== b.dataset.tab; });
  }));
  ['q', 'kind', 'level', 'provider', 'freeOnly'].forEach(id => $(id).addEventListener('input', renderCards));

  $('addForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const item = {
      id: 'custom-' + Date.now().toString(36), name: String(f.get('name') || '').trim(), provider: String(f.get('provider') || '').trim(),
      kind: f.get('kind'), level: Number(f.get('level')), url: String(f.get('url') || '').trim(), free: f.get('free') === 'on',
      topics: String(f.get('topics') || '').split(',').map(s => s.trim()).filter(Boolean),
    };
    const err = R.validateCustom(item);
    if (err.length) { $('addMsg').textContent = err.join(' · '); return; }
    state.custom = [...state.custom, item]; items = R.mergeItems(window.ROADMAP_DATA, state.custom);
    save(); renderAll(); e.target.reset(); $('addMsg').textContent = `"${item.name}"을(를) 추가했습니다`;
  });

  $('exportBtn').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([R.exportState(state)], { type: 'application/json' }));
    const a = h('a', { href: url, download: 'ai-roadmap-backup.json' }); a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $('importFile').addEventListener('change', async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    try {
      state = R.importState(await f.text()); items = R.mergeItems(window.ROADMAP_DATA, state.custom);
      save(); renderAll(); $('backupMsg').textContent = `복원 완료: 로드맵 ${Object.keys(state.plan).length}개 · 직접 추가 ${state.custom.length}개`;
    } catch (err) { $('backupMsg').textContent = '가져오기 실패: ' + err.message; }
  });

  renderAll();
})();
