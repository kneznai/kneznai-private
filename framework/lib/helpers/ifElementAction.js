async function ifElement (page, sel) {
    let isElement = '';
    try {
        isElement = await page.$eval(sel, el => {
            return (el) ? el.innerText : '';
        });
    }
    catch {};

    return isElement;
};

async function ifElementAction (page, sel, action) {
    if (ifElement(page, sel)) {
        return await action(this);
    };  
};
export { ifElement, ifElementAction };