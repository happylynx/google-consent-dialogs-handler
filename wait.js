async function wait(ms) {
    return new Promise((accept) => {
        setTimeout(accept, ms)
    })
}