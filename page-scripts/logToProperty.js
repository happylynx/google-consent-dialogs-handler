'use strict'
;(() => {
    function onMessage(message) {
        if (message.data.type !== 'logToProperty') {
            return
        }
        window._googleConsentsDialogHandler = window._googleConsentsDialogHandler || {}
        window._googleConsentsDialogHandler[message.data.key] = message.data.value
        window.removeEventListener('message', onMessage)
    }
    window.addEventListener('message', onMessage)
})()