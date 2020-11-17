/**
 * Always completes, never rejects.
 * @returns {Promise<undefined>} when the document is loaded
 */
function whenLoadedC() {
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