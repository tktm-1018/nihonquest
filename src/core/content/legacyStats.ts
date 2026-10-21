/** 旧JSONの atk/def を文理（scienceAtk など）へ複製する読込時の変換（schemas.ts から分割）。 */
export const normalizeLegacyStats = (value: unknown): unknown => {
  if (!value || typeof value !== 'object') return value;
  const stats = value as Record<string, unknown>;
  return {
    ...stats,
    scienceAtk: stats.scienceAtk ?? stats.atk,
    humanitiesAtk: stats.humanitiesAtk ?? stats.atk,
    scienceDef: stats.scienceDef ?? stats.def,
    humanitiesDef: stats.humanitiesDef ?? stats.def,
  };
};
