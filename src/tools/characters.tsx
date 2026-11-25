/**
 * キャラクター一覧（開発用）。すべての モンスターを 地方 → 県の じゅんに、絵・名前・属性・役わりつきで ならべる。
 * 絵は ゲームと 同じ 作り方（手描きの 絵が あれば それ、なければ 属性の 形で 自動生成）。
 */
import { render } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { fetchReader, loadContent, type ContentIndex } from '../core/content/loader';
import type { Monster } from '../core/content/schemas';
import { monsterArt } from '../rendering/battle/pixelArt';
import { monsterDisplaySize } from '../rendering/menuArt';
import { designedMonsterArt } from '../rendering/monsters';
import { stripRuby } from '../ui/ruby';
import './characters.css';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const ELEMENT: Record<string, [string, string]> = {
  hino: ['ひ', '#e8553a'],
  mizu: ['みず', '#3a86e8'],
  mori: ['もり', '#3aa65a'],
  kaze: ['かぜ', '#36b5b0'],
  tsuchi: ['つち', '#a8743a'],
  hikari: ['ひかり', '#d6a81e'],
  yami: ['やみ', '#7a4ab8'],
  none: ['なし', '#888'],
};

type Role = 'normal' | 'evolved' | 'mid' | 'boss' | 'last' | 'island' | 'partner';
const ROLE_LABEL: Record<Role, string> = {
  normal: 'ふつう',
  evolved: 'しんか',
  partner: 'なかま',
  mid: '中ボス',
  boss: '県ボス',
  last: 'ラスボス',
  island: '地方ボス',
};

interface Row {
  def: Monster;
  name: string;
  role: Role;
  evolvesTo?: string;
  from?: string;
}
interface Group {
  island: string;
  areaId: string;
  area: string;
  rows: Row[];
}

function roleOf(def: Monster, c: ContentIndex, evolvedIds: Set<string>): Role {
  if (c.world.islands.some((i) => i.bossId === def.id)) return 'island';
  const area = c.areas.get(def.area);
  if (area?.secret?.boss === def.id) return 'last';
  if (area?.boss === def.id) return 'boss';
  if (area?.midBoss === def.id) return 'mid';
  if (def.isBoss) return 'boss';
  if (evolvedIds.has(def.id)) return 'evolved';
  if (/kagurabi|izumiko|kodamaru/.test(def.id)) return 'partner';
  return 'normal';
}

function buildGroups(c: ContentIndex): Group[] {
  const name = (id: string) => stripRuby(c.monsters.get(id)?.name ?? id);
  const evolvedFrom = new Map<string, string>();
  for (const m of c.monsters.values()) if (m.evolution) evolvedFrom.set(m.evolution.to, m.id);
  const evolved = new Set(evolvedFrom.keys());
  const order = ['normal', 'partner', 'evolved', 'mid', 'boss', 'last', 'island'];
  const toRow = (def: Monster): Row => ({
    def,
    name: stripRuby(def.name),
    role: roleOf(def, c, evolved),
    evolvesTo: def.evolution ? name(def.evolution.to) : undefined,
    from: evolvedFrom.has(def.id) ? name(evolvedFrom.get(def.id)!) : undefined,
  });
  // しんかの ならび（もと → しんか）を くずさない よう、もとの モンスターの すぐ うしろに しんか後を おく
  const chain = (list: Monster[]): Monster[] => {
    const out: Monster[] = [];
    const seen = new Set<string>();
    const push = (m: Monster | undefined) => {
      if (!m || seen.has(m.id)) return;
      seen.add(m.id);
      out.push(m);
      if (m.evolution) push(list.find((x) => x.id === m.evolution!.to));
    };
    for (const m of list) if (!evolved.has(m.id)) push(m);
    for (const m of list) push(m);
    return out;
  };
  const groups: Group[] = [];
  const islands = [...c.world.islands].sort((a, b) => a.order - b.order);
  for (const island of islands) {
    const islandName = stripRuby(island.name);
    for (const areaId of island.areas) {
      const list = c.monstersByArea.get(areaId) ?? [];
      const rows = chain(list).map(toRow);
      rows.sort((a, b) => {
        const ra = order.indexOf(a.role) >= 3 ? order.indexOf(a.role) : 0;
        const rb = order.indexOf(b.role) >= 3 ? order.indexOf(b.role) : 0;
        return ra - rb;
      });
      groups.push({ island: islandName, areaId, area: stripRuby(c.areas.get(areaId)?.name ?? areaId), rows });
    }
    const own = c.monstersByArea.get(island.id) ?? [];
    if (own.length && !c.areas.has(island.id))
      groups.push({
        island: islandName,
        areaId: island.id,
        area: `${islandName}（地方）`,
        rows: own.map(toRow),
      });
  }
  return groups;
}

const artCache = new Map<string, string>();
function artUrl(def: Monster, c: ContentIndex): string {
  const hit = artCache.get(def.id);
  if (hit) return hit;
  const canvas =
    designedMonsterArt(def.id) ??
    monsterArt(def.id, { element: def.element, size: monsterDisplaySize(def, c), boss: def.isBoss });
  const url = canvas.toDataURL();
  artCache.set(def.id, url);
  return url;
}

function Card({ row, c }: { row: Row; c: ContentIndex }) {
  const [el, color] = ELEMENT[row.def.element] ?? ELEMENT.none!;
  const big = row.role === 'boss' || row.role === 'last' || row.role === 'island' || row.role === 'mid';
  return (
    <figure class={`ch-card ch-${row.role}`} title={row.def.id}>
      <div class="ch-art">
        <img src={artUrl(row.def, c)} alt={row.name} class={big ? 'big' : ''} loading="lazy" />
      </div>
      <figcaption>
        <b>{row.name}</b>
        <span class="ch-tags">
          <span class="ch-el" style={{ background: color }}>
            {el}
          </span>
          <span class="ch-role">{ROLE_LABEL[row.role]}</span>
        </span>
        {row.from && <small>← {row.from}</small>}
        {row.evolvesTo && <small>→ {row.evolvesTo}</small>}
      </figcaption>
    </figure>
  );
}

function App() {
  const [c, setC] = useState<ContentIndex | null>(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [island, setIsland] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    loadContent(fetchReader(`${base}/content`))
      .then(setC)
      .catch((e: unknown) => setErr(String(e)));
  }, []);
  const groups = useMemo(() => (c ? buildGroups(c) : []), [c]);
  if (err) return <p class="ch-msg">よみこみに しっぱい：{err}</p>;
  if (!c) return <p class="ch-msg">よみこみちゅう…</p>;
  const islands = [...new Set(groups.map((g) => g.island))];
  const word = q.trim();
  const shown = groups
    .filter((g) => !island || g.island === island)
    .map((g) => ({
      ...g,
      rows: g.rows.filter(
        (r) =>
          (!role || r.role === role) &&
          (!word || r.name.includes(word) || r.def.id.includes(word) || g.area.includes(word)),
      ),
    }))
    .filter((g) => g.rows.length);
  const total = shown.reduce((n, g) => n + g.rows.length, 0);
  let lastIsland = '';
  return (
    <div class="ch">
      <header class="ch-bar">
        <h1>キャラクター一覧</h1>
        <input placeholder="名前・県で さがす" value={q} onInput={(e) => setQ(e.currentTarget.value)} />
        <select value={island} onChange={(e) => setIsland(e.currentTarget.value)}>
          <option value="">ぜんぶの 地方</option>
          {islands.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <select value={role} onChange={(e) => setRole(e.currentTarget.value)}>
          <option value="">ぜんぶの 役わり</option>
          {Object.entries(ROLE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <span class="ch-count">{total} たい</span>
      </header>
      {shown.map((g) => {
        const head = g.island !== lastIsland;
        lastIsland = g.island;
        return (
          <section key={g.areaId}>
            {head && <h2>{g.island}</h2>}
            <h3>
              {g.area} <span>{g.rows.length} たい</span>
            </h3>
            <div class="ch-grid">
              {g.rows.map((r) => (
                <Card key={r.def.id} row={r} c={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

render(<App />, document.getElementById('app')!);
