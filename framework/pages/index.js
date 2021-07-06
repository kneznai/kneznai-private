import { NavigateMenu } from './navigateMenu';
import { NavigateTree } from './navigateTree';
import { NotebookPage } from './notebookPage';

const app = () => ({
    NavigateMenu: () => new NavigateMenu(),
    NavigateTree: () => new NavigateTree(),
    NotebookPage: () => new NotebookPage(),
})

export { app };