import { selectors } from 'playwright';
import { clickToNavigate } from '../lib/helpers';

const MainPage = function () {
    const btnLogin = '[href="/hub/oauth_login?next=%2Fhub%2F"]';
    this.socialLogin = '.claims-provider-list-buttons.social .options button#SystemorphAAD';
    

    this.clickLogin = async function (page) {
        await clickToNavigate(page, btnLogin);
    };

    this.checkSocialButtons = async function (page) {
        await page.waitForSelector(socialLogin);
        return socialLogin;
        
        //const optionsHandle = await page.$(socialLogin);
        //return await page.textContent('socialLogin:has(Systemorph)');
        //console.log(page.$$(socialLogin));
        //return await optionsHandle.$eval('.accountButton', {});
    };
}

export {MainPage};