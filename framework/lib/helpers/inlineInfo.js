//const InlineInfo = function () {
    
async function getInlineInfo (page, target) {
        await page.waitForSelector(target);
        const targetDiv = await page.textContent(target);
        const targetText = targetDiv.trim();
        return targetText;
    };
//};
export { getInlineInfo };