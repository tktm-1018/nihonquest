/** 旧JSONの atk/def を、文理べつの 4能力へ 複製する。 */
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
