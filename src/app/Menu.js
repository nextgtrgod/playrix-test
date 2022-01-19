import * as PIXI from 'pixi.js'
import EventEmitter from './helpers/EventEmitter.js'
import Sizes from './helpers/Sizes.js'
import MenuTrigger from './MenuTrigger.js'
import MenuItem from './MenuItem.js'

let instance = null

export default class Menu extends EventEmitter {
	constructor() {
		super()

		if (instance) return instance
		instance = this

		this.loader = PIXI.Loader.shared
		this.sizes = new Sizes()
		this.container = new PIXI.Container()
		this.container.position.y = 10
		this.trigger = new MenuTrigger()

		this.opened = false
		this.trigger.on('click', this.open.bind(this))
		this.sizes.on('resize', this.setPosition.bind(this))

		this.maxOffsetLeft = this.sizes.scene.width - (3 * (120 + 8) + 24)
		this.setPosition()

		this.setItems()
	}

	setItems() {
		const pointer = new PIXI.Sprite(this.loader.resources['menuPointer'].texture)
		pointer.anchor.set(0.5, 0)
		pointer.pivot.y = -40
		pointer.visible = false
		pointer.interactive = true
		pointer.buttonMode = true
		pointer.on('pointerup', () => {
			this.emit('done')
		})

		const margin = 8
		this.items = ['menu0', 'menu1', 'menu2'].map((source, i) => {
			const item = new MenuItem({
				source,
				index: i,
				position: {
					x: 60 + i * (120 + margin),
					y: 64,
				},
			})

			item.on('click', () => {
				this.items.forEach(item => item.deselect())
				item.toggle()
				this.emit('select', i + 1)
				pointer.position.copyFrom(item.container.position)
				pointer.visible = true
			})

			this.container.addChild(item.container)
			return item
		})

		this.container.addChild(pointer)
	}

	open() {
		this.opened = true
		this.items.forEach(item => item.show())
	}

	setPosition() {
		this.container.x = Math.min(850 + this.sizes.scene.offset.x, this.maxOffsetLeft)
	}
}