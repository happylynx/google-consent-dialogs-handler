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
    window.googleConsentsDialogHandler = window.googleConsentsDialogHandler || {}
    window.googleConsentsDialogHandler[${stringifiedKey}] = ${stringifiedValue}
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