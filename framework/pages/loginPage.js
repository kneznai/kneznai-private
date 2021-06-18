import { clickToNavigate, getInlineInfo } from '../lib/helpers';

const LoginPage = function () {
    const btnGenerate = 'input.bg-green-500';
    const btnLogin = 'input.bg-green-600';
    const signOutMessageBlock = '.border-green-400.text-green-700';
    const txtEmail = '#user_email';
    const txtPassword = '#user_password';
    
    this.login = async function (page, user) {
        await this.submitForm(page, user, btnLogin);
    };

    this.generateToken = async function (page, user) {
        await this.submitForm(page, user, btnGenerate);
    };

    this.submitForm = async function (page, user, submitLocator) {
        await page.fill(txtEmail, user.email);
        await page.click(txtPassword);
        await page.fill(txtPassword, user.password);

        // click log in or generate token button
        await clickToNavigate(page, submitLocator);
    };

    this.getSignOutMessage = async function (page) {
        const signOutMessageText = await getInlineInfo(page, signOutMessageBlock);
        return signOutMessageText;
    };
}
export { LoginPage };