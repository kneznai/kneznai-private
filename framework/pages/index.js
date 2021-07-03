import { NavigateMenu } from './navigateMenu';
import { NavigateTree } from './navigateTree';
// import { LoginPage } from './loginPage';
// import { MainPage } from './mainPage';
// import { TokenPage } from './tokenPage';

const app = () => ({
    NavigateMenu: () => new NavigateMenu(),
    NavigateTree: () => new NavigateTree(),
    // LoginPage: () => new LoginPage(),
    // MainPage: () => new MainPage(),
    // TokenPage: () => new TokenPage(),
})

export { app };