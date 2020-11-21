main()

/** handles Google "Before you continue" dialog */
async function main() {
    if (!isConsentHost()) {
        return
    }
    await whenLoaded()
    const button = findButton()
    if (button) {
        resolveDialog(button)
        noteHtmlToDom('test')
        return
    }
    noteHtmlToDom("beforeYouContinue-failAfterLoad")
    await addMutationObserver()
    noteHtmlToDom("beforeYouContinue-failAfter10s")
}

async function addMutationObserver() {
    const observedElement = document.body
    const config = {
        attributes: false,
        childList: true,
        subtree: true
    }
    let counter = 0
    function mutationCallback(mutationList, observer) {
        counter++
        const button = findButton()
        if (!button) {
            noteToDom(`mutation observer ${counter}`, 'button not found')
            return
        }
        noteToDom(`mutation observer ${counter}`, 'button found')
        observer.disconnect()
        resolveDialog(button)
    }
    const observer = new MutationObserver(mutationCallback)
    observer.observe(observedElement, config)
    await wait(10 * 1000)
    observer.disconnect()
}

/**
 * @returns {boolean}
 */
function isConsentHost() {
    const host = location.host
    return host === 'consent.youtube.com' || host.match(/^consent.google(.[a-z]{2,3})?.[a-z]{2,3}$/)
}

/**
 * @returns {HTMLElementPrototype|undefined} element to click or undefined
 */
function findButton() {
    // html body.EIlDfe div#yDmH0d.MCcOAc.IqBfM.ecJEib.EWZcud.cjGgHb.d8Etdd.LcUz9d c-wiz.SSPGKf.fkimef div.T4LgNb.eejsDc div.kFwPee div.cui-csn-data div.fkimef.I47yTd.k8Lt0 div div.OvJdSb.UTd6ef form.A28uDc div#introAgreeButton.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.wtr0xd.ic02He.M9Bg4d span.CwaK9 span.RveJvd.snByac
    const button = document.querySelector('#introAgreeButton span')
    return button
}

/**
 * @param {HTMLElementPrototype} button 
 */
function resolveDialog(button) {
    button.click()
}

/**
 * Always completes, never rejects.
 * @returns {Promise<undefined>} when the document is loaded
 */
function whenLoaded() {
    if (document.readyState == 'complete') {
        return Promise.resolve()
    }
    return messageBasedLoadEvent()
}

function messageBasedLoadEvent() {
    return new Promise(pageLoadedPromiseBody)
}

function pageLoadedPromiseBody(accept, reject) {
    let scriptElement = undefined
    function messageEventCallback(message) {
        if (message.data !== 'loaded') {
            return
        }
        window.removeEventListener('message', messageEventCallback)
        scriptElement?.remove()
        accept()
    }
    window.addEventListener('message', messageEventCallback)
    scriptElement = addScriptElement()
}

function addScriptElement() {
    const script = document.createElement('script')
    script.src = chrome.extension.getURL('page-scripts/onLoad.js')
    script.async = true
    document.head.appendChild(script)
    return script
}
