import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import Menu from './Menu.js'
import Sizes from './helpers/Sizes.js'
import { url } from '@/config'

export default class Overlay {
	constructor() {
		this.sizes = new Sizes()
		this.loader = PIXI.Loader.shared
		this.container = new PIXI.Container()
		this.menu = new Menu()

		this.setBackdrop()
		this.setLogo()
		this.setButton()
		this.setBanner()

		this.menu.on('done', this.show.bind(this))
		this.sizes.on('resize', this.resize.bind(this))
	}

	setBackdrop() {
		const graphics = new PIXI.Graphics()
		graphics.beginFill(0x000000, .6)
		graphics.drawRect(0, 0, this.sizes.scene.width, this.sizes.scene.height)
		graphics.endFill()
		graphics.on('pointerup', this.hide.bind(this))
		graphics.alpha = 0

		const tween = gsap.to(
			graphics,
			{
				alpha: 1,
				duration: .2,
				paused: true,
				onComplete: () => {
					graphics.interactive = true
				},
			},
		)

		this.backdrop = {
			graphics,
			tween,
			show() {
				this.tween.play()
			},
			hide() {
				graphics.interactive = false
				this.tween.reverse()
			},
		}

		this.container.addChild(this.backdrop.graphics)
	}

	setLogo() {
		const sprite = new PIXI.Sprite(this.loader.resources['logo'].texture)
		sprite.anchor.set(0.5)
		sprite.position.x = this.sizes.scene.offset.x + 32 + sprite.width / 2
		sprite.position.y = 5 + sprite.height / 2
		sprite.interactive = true
		sprite.buttonMode = true
		sprite.on('pointerup', this.redirect)

		sprite.scale.set(0)

		const tween = gsap.to(
			sprite.scale,
			{
				x: 1,
				y: 1,
				duration: .75,
				ease: 'elastic.out(1, 0.6)',
				delay: 1.2,
				paused: true,
				onComplete: () => {
					this.menu.trigger.show()
				},
			},
		)

		this.logo = {
			sprite,
			tween,
			resize: () => {
				sprite.position.x = this.sizes.scene.offset.x + 32 + sprite.width / 2
			},
		}

		this.container.addChild(this.logo.sprite)
		
		this.logo.tween.play()
	}

	setButton() {
		const sprite = new PIXI.Sprite(this.loader.resources['button'].texture)
		sprite.anchor.set(0.5)
		sprite.position.x = (this.sizes.scene.offset.x + this.sizes.scene.width) / 2
		sprite.position.y = this.sizes.scene.height - (sprite.height / 2 + 18)
		sprite.interactive = true
		sprite.buttonMode = true
		sprite.on('pointerup', this.redirect)

		this.button = {
			sprite,
			phase: 0,
			update(delta) {
				this.phase += delta * 0.06
				this.sprite.scale.set(1 + 0.02 * Math.sin(this.phase))
			},
			resize: () => {
				sprite.position.x = (this.sizes.scene.offset.x + this.sizes.scene.width) / 2
			},
		}
		PIXI.Ticker.shared.add(this.button.update, this.button)

		this.container.addChild(this.button.sprite)
	}

	setBanner() {
		const sprite = new PIXI.Sprite(this.loader.resources['banner'].texture)
		sprite.anchor.set(0.5)
		sprite.position.x = (this.sizes.scene.offset.x + this.sizes.scene.width) / 2
		sprite.position.y = 52 + sprite.height / 2
		sprite.buttonMode = true
		sprite.on('pointerup', this.redirect)
		sprite.alpha = 0

		const tween = gsap.to(
			sprite,
			{
				alpha: 1,
				duration: .2,
				paused: true,
				onComplete: () => {
					sprite.interactive = true
				},
			},
		)

		this.banner = {
			sprite,
			tween,
			show() {
				this.tween.play()
			},
			hide() {
				sprite.interactive = false
				this.tween.reverse()
			},
			resize: () => {
				sprite.position.x = (this.sizes.scene.offset.x + this.sizes.scene.width) / 2
			},
		}

		this.container.addChild(this.banner.sprite)
	}

	redirect() {
		window.open(url, '_blank').focus()
	}

	show() {
		this.backdrop.show()
		this.banner.show()
	}

	hide() {
		this.backdrop.hide()
		this.banner.hide()
	}

	resize() {
		this.logo.resize()
		this.button.resize()
		this.banner.resize()
	}
}