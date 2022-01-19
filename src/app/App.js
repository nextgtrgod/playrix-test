import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import Sizes from './helpers/Sizes.js'
import sources from '@/config/sources.js'
import Environment from './Environment.js'
import MenuTrigger from './MenuTrigger.js'
import Menu from './Menu.js'
import Overlay from './Overlay.js'

gsap.ticker.remove(gsap.updateRoot)

export default class App {
	constructor({ canvas } = {}) {
		if (!canvas) return console.error('canvas element is missing')

		PIXI.utils.skipHello()

		// PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

		this.sizes = new Sizes()

		this.scene = new PIXI.Application({
			view: canvas,
			width: this.sizes.viewport.width,
			height: this.sizes.viewport.height,
			sharedLoader: true,
			sharedTicker: true,
			backgroundColor: 0x111111,
			// resolution: this.viewport.pixelRatio,
			powerPreference: 'high-performance',
		})

		this.sizes.on('resize', this.setSize.bind(this))
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
		this.menuTrigger = new MenuTrigger()
		this.menu = new Menu()
		this.overlay = new Overlay()

		this.scene.stage.addChild(
			this.environment.container,
			this.menuTrigger.sprite,
			this.menu.container,
			this.overlay.container,
		)

		this.start()
		document.body.classList.remove('loading')
	}

	setSize() {
		this.scene.renderer.resize(this.sizes.viewport.width, this.sizes.viewport.height)
		this.scene.stage.scale.set(this.sizes.scene.scale)
		this.scene.stage.position.x = -this.sizes.viewport.offset.x
	}

	start() {
		this.scene.ticker.add(this.update.bind(this))
	}

	update(delta) {
		gsap.updateRoot(this.scene.ticker.lastTime / 1000)
	}
}