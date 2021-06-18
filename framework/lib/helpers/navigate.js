async function clickToNavigate (page, target) {
    await Promise.all([
        page.click(target),
        page.waitForNavigation({ waitUntil: 'networkidle' })
    ]);
};

export { clickToNavigate };