import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import Sizes from './helpers/Sizes.js'
import Menu from './Menu.js'

const objects = [
	{
		name: 'stair0',
		pivotY: 124,
	},
	{
		name: 'stair1',
		pivotY: 18,
	},
	{
		name: 'stair2',
		pivotY: 28,
	},
	{
		name: 'stair3',
		pivotY: 25,
	},
]

export default class Stairs {
	constructor() {
		this.loader = PIXI.Loader.shared
		this.sizes = new Sizes()
		this.container = new PIXI.Container()
		this.menu = new Menu()

		this.createStairs()
		this.setTweens()
		this.setCurrent(0)

		this.menu.on('select', index => {
			this.setCurrent(index)
		})
	}

	createStairs() {
		this.objects = objects.map(({ name, pivotY }) => {
			const stair = new PIXI.Sprite(this.loader.resources[name].texture)
			stair.anchor.set(1, 0)
			stair.pivot.y = -pivotY
			stair.position.set(this.sizes.scene.width, 0)
			stair.zIndex = 0
			return stair
		})
	}

	setTweens() {
		const props = {
			alpha: 0,
			y: -40,
		}

		const positionTween = gsap.to(
			props,
			{
				y: 0,
				duration: 1,
				ease: 'bounce.out',
				onUpdate: () => {
					this.current.position.y = props.y
				},
				paused: true,
			}
		)

		const alphaTween = gsap.to(
			props,
			{
				alpha: 1,
				duration: .25,
				ease: 'power1.out',
				onUpdate: () => {
					this.current.alpha = props.alpha
				},
				paused: true,
			}
		)

		this.tweens = [ positionTween, alphaTween ]
	}

	setCurrent(index) {
		if (this.current) {
			this.container.removeChild(this.current)
		}

		this.current = this.objects[index]
		this.container.addChild(this.current)

		if (index === 0) return

		this.tweens.forEach(tween => tween.restart())
	}
}