import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import EventEmitter from './helpers/EventEmitter.js'
import Sizes from './helpers/Sizes.js'

let instance = null

export default class MenuTrigger extends EventEmitter {
	constructor() {
		super()

		if (instance) return instance
		instance = this

		this.sizes = new Sizes()
		this.loader = PIXI.Loader.shared

		this.position = {
			x: this.sizes.scene.width - 252,
			y: this.sizes.scene.height - 252,
		}

		this.phase = 0

		this.setSprite()
		this.setTween()
	}

	setSprite() {
		this.sprite = new PIXI.Sprite(this.loader.resources['hammer'].texture)
		this.sprite.anchor.set(0.5, 1)
		this.sprite.position.set(this.position.x, this.position.y)
		this.sprite.buttonMode = true
		this.sprite.alpha = 0

		this.sprite.on('pointerdown', () => {
			this.emit('click')
			this.hide()
		})
	}

	setTween() {
		this.tween = gsap.to(
			this.sprite,
			{
				alpha: 1,
				duration: .25,
				onComplete: () => {
					this.sprite.interactive = true
				},
				onReverseComplete: () => {
					this.sprite.parent.removeChild(this.sprite)
				},
				paused: true,
			},
		)
	}

	show() {
		this.tween.play()
		PIXI.Ticker.shared.add(this.update, this)
	}

	hide() {
		PIXI.Ticker.shared.remove(this.update, this)
		this.sprite.interactive = false
		this.tween.duration(0.075)
		this.tween.reverse()
	}

	update(delta) {
		this.phase += delta * 0.08
		this.sprite.position.y = this.position.y + Math.sin(this.phase) * 4
	}
}