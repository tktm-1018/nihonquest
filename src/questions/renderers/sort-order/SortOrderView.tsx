import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { RendererContext } from '../../contracts';
import { t } from '../../../ui/i18n';
import { RubyLabel } from '../../../ui/RubyLabel';
import { stripRuby } from '../../../ui/ruby';
import { Feedback } from '../shared/Feedback';
import { TimerBar } from '../shared/TimerBar';
import { sortOrderScore, type SortOrderPayload } from './schema';

interface Props {
  ctx: RendererContext;
  payload: SortOrderPayload;
  order: string[];
  onDone: (result: { score: number; timedOut: boolean; selected: string[] }) => void;
}

export function SortOrderView({ ctx, payload, order, onDone }: Props) {
  const cards = useMemo(() => new Map(payload.cards.map((card) => [card.id, card])), [payload.cards]);
  const [selected, setSelected] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const doneRef = useRef(false);
  const available = order.filter((id) => !selected.includes(id));

  const choose = (id: string) => {
    if (!done && !selected.includes(id)) setSelected((current) => [...current, id]);
  };
  const undo = () => {
    if (!done) setSelected((current) => current.slice(0, -1));
  };
  const finish = (timedOut: boolean) => {
    if (doneRef.current || (!timedOut && selected.length !== payload.answer.length)) return;
    doneRef.current = true;
    const nextScore = timedOut ? 0 : sortOrderScore(payload.answer, selected);
    setScore(nextScore);
    setDone(true);
    window.setTimeout(() => onDone({ score: nextScore, timedOut, selected }), 1100);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (done) return;
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < available.length) choose(available[index]!);
      else if (event.key === 'Backspace' || event.key === 'Delete') undo();
      else if (event.key === 'Enter') finish(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    const onAbort = () => finish(true);
    ctx.signal?.addEventListener('abort', onAbort);
    return () => ctx.signal?.removeEventListener('abort', onAbort);
  });

  const cardContent = (id: string) => {
    const card = cards.get(id)!;
    return (
      <>
        {card.image && <img src={ctx.assets.image(card.image)} alt="" />}
        <RubyLabel text={card.text} grade={ctx.grade} />
      </>
    );
  };

  return (
    <div class="nq-q nq-q-sort-order">
      <TimerBar ms={ctx.timeLimitMs} running={!done} onTimeout={() => finish(true)} />
      <div class="nq-q-prompt">
        <RubyLabel text={payload.prompt} grade={ctx.grade} as="p" />
        <button
          type="button"
          class="nq-btn nq-btn-speak"
          aria-label={t('question.speak')}
          onClick={() => ctx.speak(stripRuby(payload.prompt, 'kana'))}
        >
          🔊
        </button>
      </div>

      <div class={`nq-sort-slots nq-sort-${payload.direction}`} aria-label={t('question.sortOrderSelected')}>
        {payload.cards.map((_, index) => {
          const id = selected[index];
          return id ? (
            <button
              type="button"
              class="nq-btn nq-sort-card nq-sort-picked"
              disabled={done}
              aria-label={t('question.sortOrderRemove', { n: index + 1 })}
              onClick={() => setSelected((current) => current.filter((value) => value !== id))}
            >
              <span class="nq-sort-number">{index + 1}</span>
              {cardContent(id)}
            </button>
          ) : (
            <div class="nq-sort-empty" aria-hidden="true">
              {index + 1}
            </div>
          );
        })}
      </div>

      <div class="nq-sort-cards">
        {available.map((id, index) => (
          <button
            type="button"
            class="nq-btn nq-sort-card"
            data-card-id={id}
            disabled={done}
            onClick={() => choose(id)}
          >
            <span class="nq-choice-key">{index + 1}</span>
            {cardContent(id)}
          </button>
        ))}
      </div>

      <div class="nq-sort-actions">
        <button type="button" class="nq-btn" disabled={done || selected.length === 0} onClick={undo}>
          {t('question.sortOrderUndo')}
        </button>
        <button
          type="button"
          class="nq-btn nq-sort-submit"
          disabled={done || selected.length !== payload.answer.length}
          onClick={() => finish(false)}
        >
          {t('question.sortOrderAnswer')}
        </button>
      </div>
      {done && <Feedback kind={score >= 1 ? 'correct' : score > 0 ? 'partial' : 'wrong'} />}
    </div>
  );
}
