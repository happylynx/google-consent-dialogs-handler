const runlog = {}
main()

/** handles Google "Before you continue" dialog */
async function main() {
    console.log("from main", location.href)
    if (!isConsentHost()) {
        return
    }
    if (runlog[location.href] === undefined) {
        runlog[location.href] = 0
    }
    await whenLoaded()
    console.log('loaded')
    const button = findIAgreeButton()
    if (button) {
        resolveBeforeYouContinueDialog(button)
        return
    }
}

/**
 * @returns {boolean}
 */
function isConsentHost() {
    const host = location.host
    return host === 'consent.youtube.com' || host.match(/^consent.google.[a-z]{2,7}$/)
}

/**
 * @returns {HTMLElementPrototype|undefined} element to click or undefined
 */
function findIAgreeButton() {
    // html body.EIlDfe div#yDmH0d.MCcOAc.IqBfM.ecJEib.EWZcud.cjGgHb.d8Etdd.LcUz9d c-wiz.SSPGKf.fkimef div.T4LgNb.eejsDc div.kFwPee div.cui-csn-data div.fkimef.I47yTd.k8Lt0 div div.OvJdSb.UTd6ef form.A28uDc div#introAgreeButton.U26fgb.O0WRkf.oG5Srb.HQ8yf.C0oVfc.wtr0xd.ic02He.M9Bg4d span.CwaK9 span.RveJvd.snByac
    const dialog = document.querySelector('#introAgreeButton')
    console.log('dialog', dialog)
    const button = dialog?.querySelector('span')
    console.log('button', button)
    runlog[location.href]++
    console.log(runlog[location.href], location.href, runlog)
    return button
}

/**
 * @param {HTMLElementPrototype} button 
 */
function resolveBeforeYouContinueDialog(button) {
    button.click()
}

/**
 * Always completes, never rejects.
 * @returns {Promise<undefined>} when the document is loaded
 */
function whenLoaded() {
    console.log('whenLoaded', document.readyState)
    if (document.readyState == 'complete') {
        return Promise.resolve()
    }
    console.log('document not loaded')
    return messageBasedLoadEvent()
}

function messageBasedLoadEvent() {
    return new Promise(pageLoadedPromiseBody)
}

function pageLoadedPromiseBody(accept, reject) {
    console.log('promise body')
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
