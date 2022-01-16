import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { WIDTH } from '@/config/scene.js'

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
		this.container = new PIXI.Container()

		this.createStairs()
		this.setTweens()
		this.setCurrent(0)

		if (import.meta.env.DEV) {
			document.addEventListener('keyup', ({ key }) => {
				if (![1, 2, 3].includes(+key)) return
				this.setCurrent(+key)
			})
		}
	}

	createStairs() {
		this.objects = objects.map(({ name, pivotY }) => {
			const stair = new PIXI.Sprite(this.loader.resources[name].texture)
			stair.anchor.set(1, 0)
			stair.pivot.y = -pivotY
			stair.position.set(WIDTH, 0)
			stair.zIndex = 0
			return stair
		})
	}

	setTweens() {
		this.tweens = {}

		const props = {
			alpha: 0,
			y: -40,
		}

		this.tweens.position = gsap.to(
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

		this.tweens.alpha = gsap.to(
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
	}

	setCurrent(index) {
		if (this.current) {
			this.container.removeChild(this.current)
		}

		this.current = this.objects[index]
		this.container.addChild(this.current)

		if (index === 0) return

		Object.values(this.tweens).forEach(tween => {
			tween.restart()
		})
	}
}