(() => {
    function notifyContentScript() {
        window.postMessage('loaded', '*')
    }

    function loadCallback() {
        document.removeEventListener('load', loadCallback)
        notifyContentScript()
    }

    if (document.readyState === 'complete') {
        notifyContentScript()
        return;
    }
    window.addEventListener('load', loadCallback)
})()