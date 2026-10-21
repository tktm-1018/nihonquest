/**
 * "kanji-trace"（漢字なぞり・読み）レンダラー。Preact 実装。
 * このフォルダは contracts.ts と ../shared、../../ui 以外を知らない（Phaser 禁止・GameState 禁止）。
 * 点数：trace はお手本と なぞった線の 合い具合（schema.ts の traceMatch / traceScore）。書き順は判定しない。
 *       reading は 正解 1 / ちがえば 0。時間切れ・中断は 0。
 */
import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { t } from '../../../ui/i18n';
import { RubyLabel } from '../../../ui/RubyLabel';
import type { QuestionRenderer, RendererContext } from '../../contracts';
import { Feedback } from '../shared/Feedback';
import { shuffleIds } from '../shared/shuffle';
import { TimerBar } from '../shared/TimerBar';
import {
  kanjiTracePayloadSchema,
  rasterizeStrokes,
  traceMatch,
  traceScore,
  TRACE_GRID,
  type KanjiTracePayload,
  type TracePoint,
} from './schema';

const FONT = "'UD Digi Kyokasho N-R', 'YuKyokasho', 'Hiragino Mincho ProN', 'Yu Mincho', serif";
const CANVAS_PX = 240;

interface Done {
  score: number;
  timedOut: boolean;
  attempts: number;
  match?: number;
  chosen?: string | null;
}

/** お手本を ctx に 描く（画像が 読めていれば 画像、なければ フォント） */
function drawGuide(c: CanvasRenderingContext2D, size: number, kanji: string, image: HTMLImageElement | null) {
  if (image?.complete && image.naturalWidth > 0) return c.drawImage(image, 0, 0, size, size);
  c.font = `${Math.round(size * 0.82)}px ${FONT}`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(kanji, size / 2, size * 0.53);
}

/** お手本の ます目。canvas が 使えない 環境では null */
function guideMask(kanji: string, image: HTMLImageElement | null): Uint8Array | null {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = TRACE_GRID;
  const c = canvas.getContext('2d');
  if (!c) return null;
  c.fillStyle = '#000';
  drawGuide(c, TRACE_GRID, kanji, image);
  const { data } = c.getImageData(0, 0, TRACE_GRID, TRACE_GRID);
  const mask = new Uint8Array(TRACE_GRID * TRACE_GRID);
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3]! > 64 ? 1 : 0;
  return mask;
}

function TraceView({
  payload,
  ctx,
  complete,
  done,
}: {
  payload: KanjiTracePayload;
  ctx: RendererContext;
  complete: (r: Omit<Done, 'timedOut'>) => void;
  done: Done | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<TracePoint[][]>([]);
  const drawing = useRef(false);
  const image = useRef<HTMLImageElement | null>(null);
  const [hasInk, setHasInk] = useState(false);

  const paint = () => {
    const canvas = canvasRef.current;
    const c = canvas?.getContext('2d');
    if (!canvas || !c) return;
    const size = canvas.width;
    c.clearRect(0, 0, size, size);
    c.fillStyle = 'rgba(42, 26, 5, 0.22)';
    drawGuide(c, size, payload.kanji, image.current);
    c.strokeStyle = '#1d3f8f';
    c.lineWidth = size / 10;
    c.lineCap = c.lineJoin = 'round';
    for (const stroke of strokes.current) {
      c.beginPath();
      stroke.forEach((p, i) => (i ? c.lineTo(p.x * size, p.y * size) : c.moveTo(p.x * size, p.y * size)));
      if (stroke.length === 1) c.lineTo(stroke[0]!.x * size + 0.1, stroke[0]!.y * size);
      c.stroke();
    }
  };

  useEffect(() => {
    if (!payload.guideImage) return paint();
    const img = new Image();
    img.onload = img.onerror = paint;
    img.src = ctx.assets.image(payload.guideImage);
    image.current = img;
    paint();
  }, []);

  const point = (e: PointerEvent): TracePoint => {
    const r = canvasRef.current!.getBoundingClientRect();
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    return {
      x: clamp((e.clientX - r.left) / (r.width || 1)),
      y: clamp((e.clientY - r.top) / (r.height || 1)),
    };
  };
  const down = (e: PointerEvent) => {
    if (done) return;
    drawing.current = true;
    canvasRef.current?.setPointerCapture?.(e.pointerId);
    strokes.current.push([point(e)]);
    setHasInk(true);
    paint();
  };
  const move = (e: PointerEvent) => {
    if (!drawing.current || done) return;
    strokes.current[strokes.current.length - 1]!.push(point(e));
    paint();
  };
  const up = () => (drawing.current = false);

  const clear = () => {
    strokes.current = [];
    setHasInk(false);
    paint();
  };
  const submit = () => {
    const guide = guideMask(payload.kanji, image.current);
    // canvas が 使えない 環境では 採点できないので、書いたことを 認める（子どもを 損させない）
    const match = guide ? traceMatch(guide, rasterizeStrokes(strokes.current)).match : 1;
    complete({ score: traceScore(match), attempts: 1, match });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        class="nq-kt-canvas"
        width={CANVAS_PX}
        height={CANVAS_PX}
        aria-label={t('question.kanjiTraceCanvas', { kanji: payload.kanji })}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <div class="nq-kt-actions">
        <button type="button" class="nq-btn" disabled={!!done || !hasInk} onClick={clear}>
          {t('question.kanjiTraceClear')}
        </button>
        <button type="button" class="nq-btn nq-kt-submit" disabled={!!done || !hasInk} onClick={submit}>
          {t('question.kanjiTraceDone')}
        </button>
      </div>
    </>
  );
}

function ReadingView({
  payload,
  ctx,
  order,
  complete,
  done,
}: {
  payload: KanjiTracePayload;
  ctx: RendererContext;
  order: string[];
  complete: (r: Omit<Done, 'timedOut'>) => void;
  done: Done | null;
}) {
  return (
    <div class={`nq-q-choices nq-q-choices-${order.length}`}>
      {order.map((choice, i) => {
        const state = done
          ? choice === payload.answer
            ? 'correct'
            : choice === done.chosen
              ? 'chosen'
              : 'dim'
          : 'idle';
        return (
          <button
            key={choice}
            type="button"
            class={`nq-btn nq-choice nq-choice-${state}`}
            disabled={!!done}
            onClick={() =>
              complete({ score: choice === payload.answer ? 1 : 0, attempts: 1, chosen: choice })
            }
          >
            <span class="nq-choice-key">{i + 1}</span>
            <RubyLabel text={choice} grade={ctx.grade} />
          </button>
        );
      })}
    </div>
  );
}

function View({
  payload,
  ctx,
  order,
  finish,
}: {
  payload: KanjiTracePayload;
  ctx: RendererContext;
  order: string[];
  finish: (r: Done) => void;
}) {
  const [done, setDone] = useState<Done | null>(null);
  const ended = useRef(false);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const complete = (r: Omit<Done, 'timedOut'>, timedOut = false) => {
    if (ended.current) return;
    ended.current = true;
    const result: Done = { ...r, score: timedOut ? 0 : r.score, timedOut };
    setDone(result);
    timer.current = window.setTimeout(() => finish(result), 900);
  };
  const timeout = () => complete({ score: 0, attempts: 0, chosen: null }, true);

  useEffect(() => {
    ctx.signal?.addEventListener('abort', timeout);
    if (ctx.signal?.aborted) timeout();
    return () => ctx.signal?.removeEventListener('abort', timeout);
  });

  const reading = payload.mode === 'reading';
  return (
    <div class={`nq-q nq-q-kanji-trace nq-kt-${payload.mode}`}>
      <TimerBar ms={ctx.timeLimitMs} running={done === null} onTimeout={timeout} />
      <div class="nq-q-prompt">
        <p>
          <RubyLabel
            text={t(reading ? 'question.kanjiTraceReadingPrompt' : 'question.kanjiTracePrompt')}
            grade={ctx.grade}
          />
          {!reading && payload.strokeCount && (
            <span class="nq-kt-strokes">{t('question.kanjiTraceStrokes', { n: payload.strokeCount })}</span>
          )}
        </p>
        <button
          type="button"
          class="nq-btn nq-btn-speak"
          aria-label={t('question.speak')}
          onClick={() => ctx.speak(payload.reading)}
        >
          🔊
        </button>
      </div>
      {reading && <div class="nq-kt-big">{payload.kanji}</div>}
      {payload.hintWord && !reading && (
        <RubyLabel class="nq-kt-hint" text={payload.hintWord} grade={ctx.grade} as="p" />
      )}
      {reading ? (
        <ReadingView payload={payload} ctx={ctx} order={order} complete={complete} done={done} />
      ) : (
        <TraceView payload={payload} ctx={ctx} complete={complete} done={done} />
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

export const kanjiTraceRenderer: QuestionRenderer = {
  type: 'kanji-trace',
  schema: kanjiTracePayloadSchema,
  mount(ctx) {
    const payload = kanjiTracePayloadSchema.parse(ctx.question.payload);
    const order = payload.choices ? shuffleIds(payload.choices, `${ctx.question.id}:${Date.now()}`) : [];
    const started = performance.now();
    if (ctx.signal?.aborted) {
      return Promise.resolve({
        questionId: ctx.question.id,
        score: 0,
        timedOut: true,
        attempts: 0,
        timeMs: 0,
        detail: payload.mode === 'reading' ? { chosen: null, order } : { match: null },
      });
    }
    return new Promise((resolve) =>
      render(
        <View
          payload={payload}
          ctx={ctx}
          order={order}
          finish={({ score, timedOut, attempts, match, chosen }) => {
            render(null, ctx.container);
            resolve({
              questionId: ctx.question.id,
              score,
              timedOut,
              attempts,
              timeMs: Math.round(performance.now() - started),
              detail: payload.mode === 'reading' ? { chosen, order } : { match },
            });
          }}
        />,
        ctx.container,
      ),
    );
  },
};
