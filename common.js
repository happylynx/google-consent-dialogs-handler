'use strict'

async function wait(ms) {
    return new Promise((accept) => {
        setTimeout(accept, ms)
    })
}

function noteToDom(key, value) {
    const script = document.createElement('script')
    script.src = chrome.extension.getURL('page-scripts/logToProperty.js')
    script.async = false
    script.defer = false
    script.id = 'id' + Math.random().toString().substring(2)
    document.head.appendChild(script)
    const foundScript = document.querySelector('#' + script.id)
    window.postMessage({ type: 'logToProperty', key, value }, '*')
    script.remove()
}

function noteHtmlToDom(key) {
    const html = document.body.parentElement.outerHTML
    noteToDom(key, html)
}

/**
 * 
 * @param {Element} observedElement 
 * @param {boolean} observeSubtree 
 * @param {() => Element | undefined} findButtonFn 
 * @param {(button: Element) => void} resolveDialogFn 
 */
async function addMutationObserver(observedElement, observeSubtree, findButtonFn, resolveDialogFn) {
    const config = {
        attributes: false,
        childList: true,
        subtree: observeSubtree
    }
    let counter = 0
    function mutationCallback(mutationList, observer) {
        counter++
        const button = findButtonFn()
        if (!button) {
            noteToDom(`mutation observer ${counter}`, 'button not found')
            return
        }
        noteToDom(`mutation observer ${counter}`, 'button found')
        observer.disconnect()
        resolveDialogFn(button)
    }
    const observer = new MutationObserver(mutationCallback)
    observer.observe(observedElement, config)
    await wait(10 * 1000)
    observer.disconnect()
}