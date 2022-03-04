const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
const chrome = require('selenium-webdriver/chrome')

const chromeOptions = new chrome.Options()
chromeOptions.addArguments([
    // "--headless",
    "--start-maximized",
    "--window-size=1920,1080"])

const reportAccounts = require('./toReport.json')['data'];
const loginAccounts = require('./toLogin.json')['data'];


const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

const waitForPageToLoad = (driver) => {
    driver.wait(function() {
        return driver.executeScript('return document.readyState').then(function(readyState) {
            return readyState === 'complete';
        });
    });
}

const jobDone = () => {
    console.log('Job is done.')
    process.exit();
}

const DEFAULT_WAIT = 5000;
const LONG_WAIT = 10000;

let usersProcessed = loginAccounts.length;
console.log('Starting reports bomber');
loginAccounts.forEach((user) => {
    driver.get('http://www.instagram.com').then(async () => {
        console.log(`Log into ${user.username}`);
        await driver.findElement({css: '.aOOlW.bIiDR'}).click()
        await driver.sleep(DEFAULT_WAIT);

        const login = await driver.findElement(By.name('username'));
        const password = await driver.findElement(By.name('password'));

        await login.sendKeys(user.username);
        await password.sendKeys(user.password);

        await driver.findElement({css: '.qF0y9.Igw0E.IwRSH.eGOV_._4EzTm'}).click()

        await driver.sleep(LONG_WAIT);

        console.log(`Using ${user.username}`)
        for (let toReport of reportAccounts) {
            for (let post of toReport.posts) {
                console.log(`Opening post ${post}`);
                await driver.get(post);
                waitForPageToLoad(driver);

                await driver.findElement({css: '._8-yf5'}).click()
                await driver.sleep(LONG_WAIT);
                await driver.findElement({css: '.aOOlW.-Cab_'}).click()
                await driver.sleep(LONG_WAIT);
                const reportVariants = await driver.findElements({css: '.qF0y9.fXpnZ.rBNOH.eGOV_.ybXk5._4EzTm.XfCBB.g6RW6'})

                const variant = await reportVariants[10];
                await variant.click();
                await driver.sleep(LONG_WAIT);

                const reportType = await driver.findElements({css: '.qF0y9.Igw0E.IwRSH.eGOV_.vwCYk'})

                const type = await reportType[3];
                await type.click();
                await driver.sleep(LONG_WAIT);
                console.log(`REPORTED ${post}`);
            }

            console.log(`Open report on account ${toReport.username}`);
            await driver.get(`http://www.instagram.com/${toReport.username}`);
            waitForPageToLoad(driver);

            await driver.findElement({css: '.VMs3J > .wpO6b > .QBdPU  > ._8-yf5'}).click()
            await driver.sleep(LONG_WAIT);
            const reportVariants = await driver.findElements({css: '.aOOlW.-Cab_'})
            const variant = await reportVariants[2];
            await variant.click();
            await driver.sleep(LONG_WAIT);

            const reportType = await driver.findElements({css: '.qF0y9.Igw0E.IwRSH.eGOV_.vwCYk'})
            const type = await reportType[2];
            await type.click();
            await driver.sleep(LONG_WAIT);

            const reportAccountType = await driver.findElements({css: '.qF0y9.Igw0E.IwRSH.eGOV_.vwCYk'})
            const accountType = await reportAccountType[1];
            await accountType.click();
            await driver.sleep(LONG_WAIT);

            const reportAccountTypeSpecify = await driver.findElements({css: '.qF0y9.fXpnZ.rBNOH.eGOV_.ybXk5._4EzTm.XfCBB.g6RW6'})
            const accountTypeSpecify = await reportAccountTypeSpecify[10];
            await accountTypeSpecify.click();
            await driver.sleep(LONG_WAIT);
            console.log(`REPORTED ${toReport.username}`)
        }

        console.log('Work on this account done.')
        driver.quit();
    });
    usersProcessed++;
    if (usersProcessed === loginAccounts.length) {
        jobDone();
    }
});

