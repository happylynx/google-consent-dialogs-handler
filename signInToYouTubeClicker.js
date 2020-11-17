main()

/** handles Google "Sign in to YouTube" dialog */
async function main() {
    console.log("from main")
    await whenLoaded()
    console.log('loaded')
    let button = findIAgreeButton()
    if (button) {
        resolveBeforeYouContinueDialog(button)
        return
    }
}

/**
 * @returns {HTMLElementPrototype|undefined} element to click or undefined
 */
function findIAgreeButton() {
    // html body ytd-app ytd-popup-container.style-scope.ytd-app paper-dialog.style-scope.ytd-popup-container yt-upsell-dialog-renderer.style-scope.ytd-popup-container div#dialog.style-scope.yt-upsell-dialog-renderer div#button-container.style-scope.yt-upsell-dialog-renderer div#dismiss-button.style-scope.yt-upsell-dialog-renderer yt-button-renderer.style-scope.yt-upsell-dialog-renderer.style-text.size-small a.yt-simple-endpoint.style-scope.yt-button-renderer paper-button#button.style-scope.yt-button-renderer.style-text.size-small yt-formatted-string#text.style-scope.yt-button-renderer.style-text.size-small
    let button = document.querySelector('#button')
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
    return new Promise((complete, reject) => {
        document.addEventListener('load', (loadEvent) => {
            console.log('loadEvent', loadEvent)
            complete()
        })
        console.log('load listener added')
    })
}

