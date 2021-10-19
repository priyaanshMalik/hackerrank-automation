'use strict';
const hackerrankLink = "https://www.hackerrank.com/auth/login";
const emailpassObj = require("./secrets");
const codesObj = require("./codes");
const puppeteer = require("puppeteer")


let browserStartPromise = puppeteer.launch({
    headless: false,
    // type 1sec // slowMo: 1000,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
});

let page, browser;
browserStartPromise
    .then(function (browserObj) {   //browser is opened
        console.log("Browser opened");  
        browser = browserObj
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    })
    .then(function (newTab) { //new tab is opened and opening hackerrank login/signup page
        page = newTab
        console.log("new tab opened ")
        let googeleOpenPromise = newTab.goto(hackerrankLink);
        return googeleOpenPromise;
    })
    .then(function () {//email is enterd into given field
        let emailPromise = page.type("input[id='input-1']", emailpassObj.email, { delay: 50 });
        return emailPromise;
    })
    .then(function () {//password is entered into given field
        let enteredPasswordPromise = page.type("input[type='password']", emailpassObj.password, { delay: 50 });
        return enteredPasswordPromise;
    })
    .then(function () { // loged in using password and email into the hackerrank webpage.
        console.log('logging in');
        let loginPromise =
            page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        return loginPromise;
    })
    .then(function () {//opening algorithm link for questions
        let clickOnAlgo =
            waitAndClick("a[data-attr1='algorithms']", page);
        return clickOnAlgo;
    })
    .then(function () {//selecting warmup category for filtering
        let selectWarmUp = waitAndClick("input[value='warmup']", page);
        return selectWarmUp;
    }).then(function () {   //waiting for page to load after filtering
        let waiting3sec = page.waitFor(3000);
        return waiting3sec;
    })
    .then(function () {//retrieving array for all challenges
        //ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled
        let challengesArray =
            page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled", { delay: 100 });
        return challengesArray;
    })
    .then(function (questionArr) {  //solving questions
        // n number of question first 
        console.log("number of questions", questionArr.length);
        let toBeSolvedQuestions = questionSolver(page, questionArr[0], codesObj.answers[0]);
        return toBeSolvedQuestions;
    })
    .then(function () { //ending the program after solving all questions
        console.log("question is solved");
    })

function waitAndClick(selector, currentPage) { //function to wait and return promise resolved/rejected
    return new Promise(function (resolve, reject) {
        let waitForPromise = currentPage.waitForSelector(selector, { visible: true });
        waitForPromise
            .then(function () {
                let clickWait =
                    currentPage.click(selector, { delay: 100 });
                return clickWait;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err)
            })
    }
    )
}

// return a promise -> that will submit a given question 
function questionSolver(page, question, answer) { // to solve questions
    return new Promise(function (resolve, reject) {
        let questionClicked = question.click(question[0]);
            //  code type, ctrl A+ ctrl x, click on editor,ctrl A+ctrl v
            //  reached editor
        questionClicked
            .then(function () {// focus on the editor
                let editorInFocus = waitAndClick(".monaco-editor.no-user-select.vs", page);
                return editorInFocus;
            })
            //we will do copy paste of code and thus avoid errors in code due to autocompletion
            .then(function () {
                return waitAndClick(".checkbox-input", page);
            })
            .then(function () {
                return page.waitForSelector("textarea.custominput", { visible: true });
            })
            .then(function () {
                return page.type("textarea.custominput", answer, { delay: 10 });
            })
            .then(function () {//virtually holding ctrl key
                let ctrlPressed = page.keyboard.down("Control");
                return ctrlPressed;
            })
            .then(function () {//virtually holding 'a' key to select all
                let keyAPressed = page.keyboard.press("A", { delay: 100 });
                return keyAPressed;
            })
            .then(function () {//virtually holding 'x' key to cut 
                return page.keyboard.press("X", { delay: 100 });
            })
            .then(function () {//virtually removing/unholding ctrl key
                let ctrlPressed = page.keyboard.up("Control");
                return ctrlPressed;
            })
            .then(function () {// focusing on main area to write code
                let editorInFocus =waitAndClick(".monaco-editor.no-user-select.vs", page);
                return editorInFocus;
            })
            .then(function () {//virtually holding ctrl key
                let ctrlPressed = page.keyboard.down("Control");
                return ctrlPressed;
            })
            .then(function () {//virtually holding 'a' key to select all
                let keyAPressed = page.keyboard.press("A", { delay: 100 });
                return keyAPressed;
            })
            .then(function () {//virtually holding 'v' key to paste
                let keyAPressed = page.keyboard.press("V", { delay: 100 });
                return keyAPressed;
            })
            .then(function () {
                let ctrlPressed = page.keyboard.up("Control");
                return ctrlPressed;
            })
            .then(function () {
                return page.click(".hr-monaco__run-code", { delay: 50 });
            })
            .then(function () {
                resolve();
            })
            .catch(function (err) {
                console.log(err)
                reject(err);
            })
    })
}