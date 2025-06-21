// MSW handlers for project management features
export { handlers, projectHandlers, taskHandlers } from './handlers';
export type { Project } from '~/entities/project';
export type { Task } from '~/entities/task';
export { enableMocking, worker } from './browser';
