import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import EventEmitter from './helpers/EventEmitter.js'
import MenuItem from './MenuItem.js'
import { WIDTH, HEIGHT } from '@/config/scene.js'

let instance = null

export default class Menu extends EventEmitter {
	constructor() {
		super()

		if (instance) return instance
		instance = this

		this.loader = PIXI.Loader.shared
		this.container = new PIXI.Container()
		this.opened = false

		this.setTrigger()
		this.setItems()
	}

	setTrigger() {
		const position = {
			x: WIDTH - 252,
			y: HEIGHT - 252,
		}

		const sprite = new PIXI.Sprite(this.loader.resources['hammer'].texture)
		sprite.anchor.set(0.5, 1)
		sprite.position.set(position.x, position.y)
		sprite.buttonMode = true
		sprite.alpha = 0

		const tween = gsap.to(
			sprite,
			{
				alpha: 1,
				duration: .25,
				onComplete: () => {
					sprite.interactive = true
				},
				onReverseComplete: () => {
					this.container.removeChild(sprite)
				},
				paused: true,
			},
		)

		this.trigger = {
			sprite,
			position,
			phase: 0,
			update(delta) {
				this.phase += delta * 0.08
				this.sprite.position.y = this.position.y + Math.sin(this.phase) * 4
			},
			tween,
			show() {
				this.tween.play()
				PIXI.Ticker.shared.add(this.update, this)
			},
			hide() {
				PIXI.Ticker.shared.remove(this.update, this)
				this.sprite.interactive = false
				this.tween.duration(0.075)
				this.tween.reverse()
			},
		}

		this.container.addChild(this.trigger.sprite)

		this.trigger.sprite.on('pointerdown', () => {
			this.open()
			this.trigger.hide()
		})
	}

	setItems() {
		this.itemPointer = new PIXI.Sprite(this.loader.resources['menuOk'].texture)
		this.itemPointer.anchor.set(0.5, 0)
		this.itemPointer.pivot.y = -40
		this.itemPointer.visible = false
		this.itemPointer.interactive = true
		this.itemPointer.buttonMode = true
		this.itemPointer.on('pointerup', () => {
			this.emit('done')
		})

		this.items = []

		;['menu0', 'menu1', 'menu2'].forEach((name, i) => {
			const item = new MenuItem({
				name,
				index: i,
				position: [850 + i * (120 + 8), 12 + 70],
				onClick: item => {
					this.items.forEach(item => item.deselect())
					item.toggle()
					this.emit('select', i + 1)
					this.itemPointer.position.copyFrom(item.container.position)
					this.itemPointer.visible = true
				},
			})

			this.container.addChild(item.container)

			this.items.push(item)
		})

		this.container.addChild(this.itemPointer)
	}

	open() {
		this.opened = true
		this.items.forEach(item => item.show())
	}
}