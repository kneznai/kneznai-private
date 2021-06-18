import { clickToNavigate, getInlineInfo } from '../lib/helpers';

const TokenPage = function () {
    const btnRegenerate = 'input.bg-green-500[value="Regenerate Authentication Token"]';
    const changePasswordMessageBlock = '.border-green-400.text-green-700[role="alert"]';
    const emailAddress = '#user_email_address';
    const linkChangePassword = 'a.text-green-600[href="/change_password"]';
    const linkSignOut = 'a.text-green-600[href="/logout"]';
    const regenerateTokenMessageBlock = '.border-green-400.text-green-700[role="alert"]';
    const tokenDiv = '#user_auth_token';

    this.getEmail = async function (page) {
        await page.waitForSelector(emailAddress);
        const emailAddressParagraph = await page.textContent(emailAddress);
        const emailAddressText = emailAddressParagraph.trim().substring('Email Address: '.length);
        return emailAddressText;
    };

    this.getToken = async function (page) {
        const tokenParagraph = await page.textContent(tokenDiv);
        const token = tokenParagraph.trim().substring('Authentication Token: '.length);
        return token;
    };

    this.clickSignOut = async function (page) {
        await clickToNavigate(page, linkSignOut);
    };

    this.clickRegenerate = async function (page) {
        await clickToNavigate(page, btnRegenerate);
    };

    this.clickChangePassword = async function (page) {
        await clickToNavigate(page, linkChangePassword);
    };

    this.getChangePassMessage = async function (page) {
        const changePasswordMessageText = await getInlineInfo(page, changePasswordMessageBlock);
        return changePasswordMessageText;
    };

    this.getRegenerateMessage = async function (page) {
        const regenerateTokenMessageText = await getInlineInfo(page, regenerateTokenMessageBlock);
        return regenerateTokenMessageText;
    };
}
export { TokenPage };