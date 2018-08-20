document.addEventListener('DOMContentLoaded', function() {
    const scene = document.querySelector('a-scene');
    const splash = document.querySelector('#splash');
    const loading = document.querySelector('#splash .loading');
    const startButton = document.querySelector('#splash .start-button');
    const anchorSceneButton = document.querySelector('#anchor-scene-button');
    const rotateSceneButton = document.querySelector('#rotate-scene-button');
    const anchorInnerContainer = document.querySelector('#anchor-inner-container');
    const anchorLocalContainer = document.querySelector('#anchor-local-container');
    let newY = 0;
    let lastRotation = '0 0 0';

    const toggleFullScreen = () => {
        const doc = window.document;
        const docEl = doc.documentElement;

        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            if (requestFullScreen) requestFullScreen.call(docEl);
        }
        else {
            if (cancelFullScreen) cancelFullScreen.call(doc);
        }
    }

    const emitEvent = (eventName, listeners) => {
        listeners.forEach((listener) => {
            const el = document.querySelector(listener);
            el.emit(eventName);
        })
    };

    const emitMediaEvent = (eventType, listeners) => {
        listeners.forEach((listener) => {
            const el = document.querySelector(listener);
            el.components.sound[eventType]();
        })
    };

    const activateSoundsForTouch = () => {
        const sounds = document.querySelectorAll('a-sound')
        sounds.forEach((soundEl) => {
            soundEl.components.sound.playSound();
            soundEl.components.sound.stopSound();
        })
    };

    scene.addEventListener('loaded', function (e) {
        setTimeout(() => {
            loading.style.display = 'none';
            splash.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
            startButton.style.opacity = 1;
        }, 50);
    });

    startButton.addEventListener('click', function (e) {
        toggleFullScreen();
        splash.style.display = 'none';
        anchorSceneButton.style.display = 'block';
        rotateSceneButton.style.display = 'block';
        emitEvent('scene-started', ['#rmb', '#text']);
    });

    anchorSceneButton.addEventListener('click', function (e) {
        const rotation = anchorInnerContainer.getAttribute('rotation').x === 0 ? -90 : 0;
        anchorInnerContainer.setAttribute('rotation', `${rotation} 0 0`);
    });

    rotateSceneButton.addEventListener('click', function (e) {
        newY -= 45;
        const rotation = anchorLocalContainer.getAttribute('rotation');
        const newRotation = `${rotation.x} ${newY} ${rotation.z}`;

        anchorLocalContainer.setAttribute('animation', {
            'property': 'rotation',
            'from' : lastRotation,
            'to': newRotation,
            'easing': 'easeOutQuad',
            'dur': 1000
        });
        lastRotation = newRotation;
    });
});