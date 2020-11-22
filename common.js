'use strict'

async function wait(ms) {
    return new Promise((accept) => {
        setTimeout(accept, ms)
    })
}

function noteToDom(key, value) {
    const stringifiedKey = JSON.stringify(key)
    const stringifiedValue = JSON.stringify(value)
    const script = document.createElement('script')
    script.text = `
    window._googleConsentsDialogHandler = window._googleConsentsDialogHandler || {}
    window._googleConsentsDialogHandler[${stringifiedKey}] = ${stringifiedValue}
    console.log('inner', window.location.href, window._googleConsentsDialogHandler)
    `
    script.async = false
    script.defer = false
    document.head.appendChild(script)
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