import App from './app/App.js'

const app = new App({
	canvas: document.getElementById('scene'),
})

if (import.meta.env.DEV) window.app = app