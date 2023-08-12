const playwright = require('playwright')
const { snapshot } = require("process-list");
const GoLogin = require("gologin");

;(async () => {
  const sleep = async (millis) => {
    return new Promise((resolve) => setTimeout(resolve, millis));
  };
  
  const GL = new GoLogin({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjczMzJkMTc5ZTUwYTUyZTIwODI4ODQiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MzYyNDAyMTY3OWQzYzhiYWViM2QzMjAifQ.pQpUgK2zorEooud9A6X47GY_gwhGf48uimeyZY0_2Us',
        profile_id: '639ff4adb0dc280026f16a42',
    skipOrbitaHashChecking: true,
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);
    return { status: "failure" };
  });

  const browser = await playwright.chromium.connectOverCDP(wsUrl);
  let page;
  let contexts = browser.contexts();
    const browserContext = contexts[0];
    let context = contexts[0];
    let pages = await context.pages();
    const vis_results = await Promise.all(
      pages.map(async (p, index) => {
        if (pages.length - 1 === index) {
          console.log("don't close tinder.com page");
          page = p;
          return;
        }
        console.log("closing tinder.com page");
        p.close();
      })
    );

   await Promise.all([
      page.goto('https://tinder.com', { waitUntil: "networkidle", timeout: 0 }),
      page.waitForNavigation({ waitUntil: "networkidle", timeout: 0 }),
    ]);
  await sleep(5000)

  const login = async() => {
    const loginButton = page.locator('div:has-text("Log in")');
    if (loginButton)
      console.log(loginButton)
    const boundingBox = await loginButton.boundingBox();
    if (boundingBox) {
      await page.mouse.click(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
      await sleep(2000);
      const googleLoginButton = await page.waitForSelector('div.focus-button-style');
      if (googleLoginButton) {
        boundingBox = await googleLoginButton.boundingBox();
        await page.mouse.click(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);
      }
    }
  }

  // await login();
  await sleep(1000000)
  await browser.close()
})()

