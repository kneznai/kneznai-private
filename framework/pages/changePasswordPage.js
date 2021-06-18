import { clickToNavigate, getInlineInfo } from '../lib/helpers';

const ChangePasswordPage = function () {
    const btnChangePass = 'input.bg-green-500';
    const txtCurrPass = '#current_password';
    const txtUserPass = '#user_password';
    const txtUserPassConfirm = '#user_password_confirmation';
    
    this.changePassword = async function (page, user) {
        await this.submitForm(page, user);
    };

    this.submitForm = async function (page, user) {
        await page.fill(txtCurrPass, user.oldPassword);
        await page.fill(txtUserPass, user.password);
        await page.fill(txtUserPassConfirm, user.password);

        await clickToNavigate(page, btnChangePass);
    };
}
export { ChangePasswordPage };