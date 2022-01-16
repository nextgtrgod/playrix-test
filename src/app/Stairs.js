import * as PIXI from 'pixi.js'
import { gsap } from 'gsap'
import { WIDTH } from '@/config/scene.js'

const objects = [
	{
		name: 'stair0',
		y: 124,
	},
	{
		name: 'stair1',
		y: 18,
	},
	{
		name: 'stair2',
		y: 28,
	},
	{
		name: 'stair3',
		y: 25,
	},
]

export default class Stairs {
	constructor() {
		this.loader = PIXI.Loader.shared
		this.container = new PIXI.Container()

		this.createStairs()
		this.setCurrent(0)

		document.addEventListener('keyup', ({ key }) => {
			if (![1, 2, 3].includes(+key)) return
			
			this.setCurrent(+key)
		})
	}

	createStairs() {
		this.objects = objects.map(({ name, y }) => {
			const stair = new PIXI.Sprite(this.loader.resources[name].texture)
			stair.anchor.set(1, 0)
			stair.position.set(WIDTH, y)
			stair.zIndex = 0
			return stair
		})
	}

	setCurrent(index) {
		if (this.current) this.current.alpha = 0

		this.current = this.objects[index]
		this.container.addChild(this.current)
		
		const offset = 40
		const params = {
			alpha: 0,
			y: this.current.position.y - offset,
		}

		if (!index) return

		const positionTween = gsap.to(
			params,
			{
				y: this.current.position.y,
				duration: 1,
				ease: 'bounce.out',
				onUpdate: () => {
					this.current.position.y = params.y
				}
			}
		)

		const alphaTween = gsap.to(
			params,
			{
				alpha: 1,
				duration: .25,
				ease: 'power1.out',
				onUpdate: () => {
					this.current.alpha = params.alpha
				}
			}
		)
	}
}