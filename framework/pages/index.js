import { ChangePasswordPage } from './changePasswordPage';
import { LoginPage } from './loginPage';
import { MainPage } from './mainPage';
import { TokenPage } from './tokenPage';

const app = () => ({
    ChangePasswordPage: () => new ChangePasswordPage(),
    LoginPage: () => new LoginPage(),
    MainPage: () => new MainPage(),
    TokenPage: () => new TokenPage(),
})

export { app };