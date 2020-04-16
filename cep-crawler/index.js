const puppeteer = require('puppeteer');

const UF_SELECT = '#Geral > div > div > span:nth-child(3) > label > select';
const LOCATION_INPUT = '#Geral > div > div > span:nth-child(5) > label > input';
const NEIGHBORHOOD_INPUT = '#Geral > div > div > span:nth-child(7) > label > input';
const SEARCH_BUTTON = '#Geral > div > div > div.btnform > input';
const CEP_COLUMN = 'body > div.back > div.tabs > div:nth-child(2) > div > div > div.column2 > div.content > div > table > tbody > tr > td:nth-child(4)';
const NEXT_BUTTON = 'body > div.back > div.tabs > div:nth-child(2) > div > div > div.column2 > div.content > div.ctrlcontent > div:nth-child(11) > a';

const getCeps = async (page, ceps = []) => {
  console.log('Searching page...');
  try {
    await page.waitForSelector(CEP_COLUMN, { timeout: 3500 });
  } catch (_err) {
    return ceps;
  }

  const pageCeps = await page.evaluate((CEP_COLUMN) => {
    const ceps = document.querySelectorAll(CEP_COLUMN);
    return Array.from(ceps).map((cep) => cep.innerHTML.replace('-', ''));
  }, CEP_COLUMN);

  ceps.push(...pageCeps);

  if (await page.$(NEXT_BUTTON) !== null) {
    await page.click(NEXT_BUTTON);
    await page.waitFor(2000);
    return getCeps(page, ceps);
  }

  return ceps;
};

module.exports = async ({ state, location, neighborhood }) => {
  let browser;
  let page;

  try {
    browser = await puppeteer.launch({ /* executablePath: 'chromium-browser',*/ headless: false });
    console.log('Browser started');
    page = await browser.newPage();
    console.log('Page opened');

    console.log(`Searching CEPs for state: ${state}, location: ${location}, neighborhood: ${neighborhood}`);
    await page.goto('http://www.buscacep.correios.com.br/sistemas/buscacep/buscaLogBairro.cfm', { waitUntil: 'networkidle2' });

    await page.select(UF_SELECT, state);

    await page.focus(LOCATION_INPUT);
    await page.keyboard.type(location);

    await page.focus(NEIGHBORHOOD_INPUT);
    await page.keyboard.type(neighborhood);

    await page.click(SEARCH_BUTTON);
  
    const ceps = await getCeps(page);
  
    return ceps;
  } catch (err) {
    console.error('Error searchin CEPs:', err);
    throw err;
  } finally {
    if (page) {
      console.log('Closing page');
      await page.close();
    }
    if (browser) {
      console.log('Closing browser');
      await browser.close();
    }
  }
};
