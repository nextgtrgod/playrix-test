import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import Viewport from './helpers/Viewport.js'
import sources from '@/config/sources.js'
import Environment from './Environment.js'
import Controls from './Controls.js'
import { WIDTH, HEIGHT } from '@/config/scene.js'

gsap.ticker.remove(gsap.updateRoot)

export default class App {
	constructor({ canvas } = {}) {
		if (!canvas) return console.error('canvas element is missing')
		if (import.meta.env.DEV) window.app = this

		PIXI.utils.skipHello()

		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

		this.viewport = new Viewport()

		this.scene = new PIXI.Application({
			view: canvas,
			width: WIDTH,
			height: HEIGHT,
			sharedLoader: true,
			backgroundColor: 0x232323,
			resolution: this.viewport.pixelRatio,
			powerPreference: 'high-performance',
		})

		this.viewport.on('resize', this.setSize.bind(this))
		this.setSize()

		this.setStage()
	}

	load(sources) {
		return new Promise(resolve => {
			sources.forEach(({ name, path }) => this.scene.loader.add(name, path))
			this.scene.loader.load(resolve)
		})
	}

	async setStage() {
		await this.load(sources)

		this.environment = new Environment()
		this.controls = new Controls()

		this.scene.stage.addChild(
			this.environment.container,
			// this.stairs.container,
			this.controls.container,
		)

		this.start()
		document.body.classList.remove('loading')
	}

	setSize() {
		const W = window.innerWidth
		const H = window.innerHeight

		this.scene.renderer.resize(W, H)

		const scale = W / H >= WIDTH / HEIGHT
			? W / WIDTH
			: H / HEIGHT

		this.scene.stage.scale.set(scale)

		this.scene.stage.x = W - scale * WIDTH
		this.scene.stage.y = H - scale * HEIGHT
	}

	start() {
		this.scene.ticker.add(this.update.bind(this))
	}

	update(delta) {
		gsap.updateRoot(this.scene.ticker.lastTime / 1000)
	}
}