export function getSingleOrError<T>(entityArray: T[], errorMessage: string) {
  const entity = entityArray[0];
  if (!entity) {
    throw new Error(errorMessage);
  }
  return entity;
}
