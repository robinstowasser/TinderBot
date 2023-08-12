const puppeteer = require("puppeteer-core");
const GoLogin = require("gologin");

(async () => {
  const GL = new GoLogin({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MjczMzJkMTc5ZTUwYTUyZTIwODI4ODQiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2MzViNDNmYzYyMzI4NjljYjIwNjA0NDcifQ.a5qEZGDbA1pHWgxih1iqM-Z8ea1tDzBiRcEqFbHXLSo',
        profile_id: '6395631a321b42ed896410e2',
    skipOrbitaHashChecking: true,
  });

  const { status, wsUrl } = await GL.start().catch((e) => {
    console.trace(e);
    return { status: "failure" };
  });

  if (status !== "success") {
    console.log("Invalid status");
    return;
  }

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl.toString(),
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  const cookies = await page.context().cookies()
  console.log(cookies)
  await page.goto("https://myip.link/mini");
  await browser.close();
  await GL.stop();
})();
