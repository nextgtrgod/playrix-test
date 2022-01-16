import * as PIXI from 'pixi.js'
import sources from '@/config/sources.js'
import Environment from './Environment.js'

export default class App {
	constructor({ canvas } = {}) {
		if (!canvas) return console.error('canvas element is missing')

		PIXI.utils.skipHello()

		this.scene = new PIXI.Application({
			view: canvas,
			width: 1390,
			height: 640,
			sharedLoader: true,
			backgroundColor: 0x000000,
			powerPreference: 'high-performance',
		})

		this.init()
	}

	load(sources) {
		return new Promise(resolve => {
			sources.forEach(({ name, path }) => this.scene.loader.add(name, path))
			this.scene.loader.load(resolve)
		})
	}

	async init() {
		await this.load(sources)

		this.environment = new Environment()
		this.scene.stage.addChild(this.environment.container)


		this.start()
		document.body.classList.remove('loading')
	}

	start() {
		this.scene.ticker.add((...args) => this.update(...args))
	}

	update(delta) {

	}
}