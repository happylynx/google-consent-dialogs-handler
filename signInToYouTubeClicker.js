'use strict'

main()

/** handles Google "Sign in to YouTube" dialog */
async function main() {
    if (!isYoutubePage()) {
        return
    }
    await whenLoaded()
    let button = findButton()
    if (button) {
        resolveDialog(button)
        return
    }
    noteHtmlToDom("signInToYoutube-failAfterLoad")
    await addMutationObserver(
        document.querySelector('ytd-app'),
        false,
        findButton,
        resolveDialog
    )
    noteHtmlToDom("signInToYoutube-failAfter10s")
}

/**
 * @returns {HTMLElementPrototype|undefined} element to click or undefined
 */
function findButton() {
    // html body ytd-app ytd-popup-container.style-scope.ytd-app paper-dialog.style-scope.ytd-popup-container yt-upsell-dialog-renderer.style-scope.ytd-popup-container div#dialog.style-scope.yt-upsell-dialog-renderer div#button-container.style-scope.yt-upsell-dialog-renderer div#dismiss-button.style-scope.yt-upsell-dialog-renderer yt-button-renderer.style-scope.yt-upsell-dialog-renderer.style-text.size-small a.yt-simple-endpoint.style-scope.yt-button-renderer paper-button#button.style-scope.yt-button-renderer.style-text.size-small yt-formatted-string#text.style-scope.yt-button-renderer.style-text.size-small
    let button = document.querySelector('yt-upsell-dialog-renderer #button:not([class~=style-suggestive])')
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
    console.warn('Ups. This still needs some love.')
}

function isYoutubePage() {
    return location.host !== 'consent.youtube.com'
}
