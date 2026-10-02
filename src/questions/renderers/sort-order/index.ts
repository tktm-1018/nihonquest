import { h, render } from 'preact';
import type { QuestionRenderer, QuestionResult, RendererContext } from '../../contracts';
import { shuffleIds } from '../shared/shuffle';
import { SortOrderView } from './SortOrderView';
import { sortOrderPayloadSchema } from './schema';

export const sortOrderRenderer: QuestionRenderer = {
  type: 'sort-order',
  schema: sortOrderPayloadSchema,
  mount(ctx: RendererContext): Promise<QuestionResult> {
    const payload = sortOrderPayloadSchema.parse(ctx.question.payload);
    const startedAt = performance.now();
    const order = shuffleIds(
      payload.cards.map((card) => card.id),
      `${ctx.question.id}:${startedAt}`,
    );
    return new Promise((resolve) => {
      render(
        h(SortOrderView, {
          ctx,
          payload,
          order,
          onDone: ({ score, timedOut, selected }) => {
            render(null, ctx.container);
            resolve({
              questionId: ctx.question.id,
              score,
              timeMs: Math.round(performance.now() - startedAt),
              attempts: timedOut ? 0 : 1,
              timedOut,
              detail: { order: selected },
            });
          },
        }),
        ctx.container,
      );
    });
  },
};
