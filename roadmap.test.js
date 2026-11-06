// 실행: node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const R = require('./roadmap.js');
global.window = {};
require('./data.js');
const DATA = global.window.ROADMAP_DATA;

test('기본 데이터: id 중복 없음, 필수 값과 https 링크', () => {
  const ids = DATA.map(i => i.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const i of DATA) {
    assert.deepEqual(R.validateCustom(i), [], i.id);
    assert.match(i.url, /^https:\/\//, i.id);
  }
});

test('필터: 종류·난이도·기관·무료·검색어 조합', () => {
  assert.ok(R.filter(DATA, { kind: 'course', freeOnly: true }).every(i => i.kind === 'course' && i.free));
  assert.ok(R.filter(DATA, { level: '3' }).every(i => i.level === 3));
  assert.ok(R.filter(DATA, { q: 'llm' }).length >= 1);
  assert.equal(R.filter(DATA, { q: '존재하지않는단어' }).length, 0);
  const p = R.providers(DATA)[0];
  assert.ok(R.filter(DATA, { provider: p }).every(i => i.provider === p));
});

test('사용자 항목은 같은 id의 기본 항목을 덮어씀', () => {
  const m = R.mergeItems([{ id: 'a', name: 'base' }], [{ id: 'a', name: 'mine' }, { id: 'b', name: 'new' }]);
  assert.equal(m.length, 2);
  assert.equal(m.find(i => i.id === 'a').name, 'mine');
  assert.equal(m.find(i => i.id === 'a').custom, true);
});

test('계획: 진행률 범위 제한, 완료하면 100%, 100%면 완료', () => {
  let p = R.setPlan({}, 'x', {});
  assert.equal(p.x.status, '계획');
  p = R.setPlan(p, 'x', { progress: 150 });
  assert.equal(p.x.progress, 100);
  assert.equal(p.x.status, '완료');
  p = R.setPlan(R.setPlan({}, 'y', { progress: -5 }), 'y', { status: '완료' });
  assert.equal(p.y.progress, 100);
  p = R.setPlan(p, 'y', { status: '없는상태' });
  assert.equal(p.y.status, '완료');
  assert.deepEqual(R.removePlan(p, 'y'), {});
});

test('남은 일수', () => {
  const today = new Date(2026, 10, 6);
  assert.equal(R.daysLeft('2026-11-16', today), 10);
  assert.equal(R.daysLeft('2026-11-01', today), -5);
  assert.equal(R.daysLeft('', today), null);
  assert.equal(R.daysLeft('11/16', today), null);
});

test('요약: 보류는 평균에서 제외, 데이터에 없는 id 무시', () => {
  let p = R.setPlan({}, DATA[0].id, { progress: 50, status: '진행 중' });
  p = R.setPlan(p, DATA[1].id, { status: '완료' });
  p = R.setPlan(p, DATA[2].id, { status: '보류', progress: 0 });
  p = R.setPlan(p, 'deleted-item', { progress: 10 });
  const s = R.summary(p, DATA);
  assert.equal(s.total, 3);
  assert.equal(s.avgProgress, 75);
  assert.equal(s.byStatus['완료'], 1);
});

test('항목 추가 검증', () => {
  assert.ok(R.validateCustom({ name: '', kind: 'cert', level: 1 }).length);
  assert.ok(R.validateCustom({ name: 'x', kind: 'cert', level: 1, url: 'javascript:alert(1)' }).length);
  assert.deepEqual(R.validateCustom({ name: 'x', kind: 'course', level: '2', url: 'https://a.b' }), []);
});

test('백업 왕복과 잘못된 파일 거부', () => {
  const state = { plan: R.setPlan({}, 'a', { progress: 30, memo: '메모' }), custom: [{ id: 'c1', name: 'n', kind: 'cert', level: 1 }, { id: 'bad', name: '', kind: 'x', level: 9 }] };
  const back = R.importState(R.exportState(state));
  assert.equal(back.plan.a.progress, 30);
  assert.equal(back.plan.a.memo, '메모');
  assert.equal(back.custom.length, 1);
  assert.throws(() => R.importState('{}'), /백업 파일/);
  assert.throws(() => R.importState('x'), /JSON/);
});
