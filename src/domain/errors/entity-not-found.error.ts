export class EntityNotFoundError extends Error {
  constructor(id: string, type: string) {
    super(`Could not find ${type} with id ${id}`);
  }
}