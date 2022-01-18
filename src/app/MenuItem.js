import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'

export default class MenuItem {
	constructor({ index, name, position, onClick } = {}) {
		this.index = index
		this.name = name
		this.position = position
		this.onClick = onClick

		this.loader = PIXI.Loader.shared

		this.container = new PIXI.Container()
		this.container.position.set(...position)

		this.container.alpha = 0

		this.selected = false

		this.setSprite()
		this.setTweens()
	}

	setSprite() {
		this.bg = new PIXI.Sprite(this.loader.resources['menuBg'].texture)
		this.bg.interactive = true
		this.bg.buttonMode = true
		this.container.addChild(this.bg)

		this.container.pivot.set(this.container.width / 2, this.container.height / 2)

		this.selection = new PIXI.Sprite(this.loader.resources['menuSelected'].texture)
		this.selection.anchor.set(0.5)
		this.selection.position.set(this.container.width / 2, this.container.height / 2 - 4)
		this.selection.alpha = 0
		this.container.addChild(this.selection)

		this.option = new PIXI.Sprite(this.loader.resources[this.name].texture)
		this.option.anchor.set(0.5)
		this.option.position.set(this.container.width / 2, this.container.height / 2 - 6)

		this.container.addChild(this.option)

		this.bg.on('pointerup', () => {
			if (this.selected) return
			this.onClick(this)
		})
	}

	setTweens() {
		this.tweens = []

		const delay = this.index * 0.25

		const alphaTween = gsap.to(
			this.container,
			{
				alpha: 1,
				duration: .25,
				paused: true,
				delay,
			},
		)
		
		this.container.scale.set(0)
		const scaleTween = gsap.to(
			this.container.scale,
			{
				x: 1,
				y: 1,
				duration: 1,
				ease: 'elastic.out(1, 0.6)',
				delay,
				paused: true,
			},
		)

		this.tweens = [ alphaTween, scaleTween ]
	}

	show() {
		this.tweens.forEach(tween => tween.play())
	}

	deselect() {
		this.selected = false
		this.selection.alpha = 0
	}

	toggle() {
		this.selected = !this.selected
		this.selection.alpha = +this.selected
	}
}