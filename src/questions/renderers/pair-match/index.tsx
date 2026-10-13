/**
 * "pair-match"（ペア合わせ）レンダラー。Preact 実装。
 * このフォルダは contracts.ts と ../shared、../../ui 以外を知らない（Phaser 禁止・GameState 禁止）。
 * 点数：ミス回数で減点（schema.ts の pairMatchScore）。時間切れ・中断は 0。
 */
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { t } from '../../../ui/i18n';
import { RubyLabel } from '../../../ui/RubyLabel';
import type { QuestionRenderer, RendererContext } from '../../contracts';
import { Feedback } from '../shared/Feedback';
import { shuffleIds } from '../shared/shuffle';
import { TimerBar } from '../shared/TimerBar';
import { pairMatchPayloadSchema, pairMatchScore, type PairFace, type PairMatchPayload } from './schema';

/** カード id は "<ペア番号>:a" / "<ペア番号>:b" */
const pairOf = (id: string) => id.split(':')[0]!;
const sideOf = (id: string) => id.split(':')[1]!;

interface Done {
  score: number;
  timedOut: boolean;
  misses: number;
  attempts: number;
}

function Face({ face, ctx }: { face: PairFace; ctx: RendererContext }) {
  return (
    <>
      {face.image && <img src={ctx.assets.image(face.image)} alt="" />}
      {face.text && <RubyLabel text={face.text} grade={ctx.grade} />}
    </>
  );
}

function View({
  payload,
  ctx,
  order,
  finish,
}: {
  payload: PairMatchPayload;
  ctx: RendererContext;
  order: string[];
  finish: (r: Done) => void;
}) {
  const [matched, setMatched] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [missFlash, setMissFlash] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const misses = useRef(0);
  const attempts = useRef(0);
  const ended = useRef(false);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((id) => clearTimeout(id)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const complete = (timedOut: boolean) => {
    if (ended.current) return;
    ended.current = true;
    const result: Done = {
      score: timedOut ? 0 : pairMatchScore(misses.current, payload.pairs.length),
      timedOut,
      misses: misses.current,
      attempts: attempts.current,
    };
    setDone(result);
    later(() => finish(result), 900);
  };

  useEffect(() => {
    const abort = () => complete(true);
    ctx.signal?.addEventListener('abort', abort);
    if (ctx.signal?.aborted) abort();
    return () => ctx.signal?.removeEventListener('abort', abort);
  });

  const pick = (id: string) => {
    if (ended.current || missFlash || matched.includes(id) || open.includes(id)) return;
    const first = open[0];
    if (first === undefined) return setOpen([id]);
    // 見えたままの ときは 同じ れつを 押しなおすと えらびなおし（ミスに しない）
    if (!payload.faceDown && sideOf(first) === sideOf(id)) return setOpen([id]);
    attempts.current += 1;
    ctx.onProgress?.({ attempts: attempts.current });
    if (pairOf(first) === pairOf(id) && sideOf(first) !== sideOf(id)) {
      const next = [...matched, first, id];
      setMatched(next);
      setOpen([]);
      if (next.length === order.length) complete(false);
      return;
    }
    misses.current += 1;
    setOpen([first, id]);
    setMissFlash(true);
    later(() => {
      setOpen([]);
      setMissFlash(false);
    }, 800);
  };

  const card = (id: string) => {
    const pair = payload.pairs[Number(pairOf(id))]!;
    const face = sideOf(id) === 'a' ? pair.a : pair.b;
    const isMatched = matched.includes(id);
    const shown = !payload.faceDown || isMatched || open.includes(id) || done !== null;
    const state = isMatched ? 'matched' : open.includes(id) ? (missFlash ? 'miss' : 'open') : '';
    return (
      <button
        type="button"
        key={id}
        class={`nq-pm-card ${state ? `nq-pm-${state}` : ''} ${shown ? '' : 'nq-pm-back'}`}
        disabled={done !== null || isMatched}
        aria-pressed={open.includes(id)}
        aria-label={shown ? undefined : t('question.pairMatchBack')}
        onClick={() => pick(id)}
      >
        {shown ? <Face face={face} ctx={ctx} /> : '？'}
      </button>
    );
  };

  return (
    <div class="nq-q nq-q-pair-match">
      <TimerBar ms={ctx.timeLimitMs} running={done === null} onTimeout={() => complete(true)} />
      <RubyLabel class="nq-q-prompt" text={payload.prompt} grade={ctx.grade} as="p" />
      {payload.faceDown ? (
        <div class={`nq-pm-grid nq-pm-grid-${order.length}`}>{order.map(card)}</div>
      ) : (
        <div class="nq-pm-columns">
          <div class="nq-pm-column">{order.filter((id) => sideOf(id) === 'a').map(card)}</div>
          <div class="nq-pm-column">{order.filter((id) => sideOf(id) === 'b').map(card)}</div>
        </div>
      )}
      {done && (
        <Feedback
          kind={
            done.timedOut ? 'timeout' : done.score >= 1 ? 'correct' : done.score > 0 ? 'partial' : 'wrong'
          }
        />
      )}
    </div>
  );
}

export const pairMatchRenderer: QuestionRenderer = {
  type: 'pair-match',
  schema: pairMatchPayloadSchema,
  mount(ctx) {
    const payload = pairMatchPayloadSchema.parse(ctx.question.payload);
    const ids = payload.pairs.flatMap((_, i) => [`${i}:a`, `${i}:b`]);
    const order = shuffleIds(ids, `${ctx.question.id}:${Date.now()}`);
    const started = performance.now();
    return new Promise((resolve) =>
      render(
        <View
          payload={payload}
          ctx={ctx}
          order={order}
          finish={({ score, timedOut, misses, attempts }) => {
            render(null, ctx.container);
            resolve({
              questionId: ctx.question.id,
              score,
              timedOut,
              attempts,
              timeMs: Math.round(performance.now() - started),
              detail: { misses, order },
            });
          }}
        />,
        ctx.container,
      ),
    );
  },
};
