if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw_firstWorker.js')
            .then(function (registration) {
                // success
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function (err) {
                // failed
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
