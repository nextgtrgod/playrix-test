import EventEmitter from './EventEmitter.js'
import debounce from '@/utils/debounce.js'
import { WIDTH, HEIGHT, ASPECT } from '@/config/scene.js'

let instance = null

export default class Sizes extends EventEmitter {
	constructor() {
		super()

		if (instance) return instance
		instance = this

		this.viewport = {
			width: 0,
			height: 0,
			offset: {
				x: 0,
			},
		}
		this.scene = {
			width: WIDTH,
			height: HEIGHT,
			scale: 1,
			offset: {
				x: 0,
			},
		}

		this.setSizes()

		window.addEventListener('resize', debounce(
			() => {
				this.setSizes()
				this.emit('resize')
			},
			250,
		))
	}

	setSizes() {
		const W = window.innerWidth
		const H = window.innerHeight
		// this.pixelRatio = Math.min(window.devicePixelRatio, 2)

		const currentAspect = W / H

		if (currentAspect >= ASPECT) {
			this.scene.scale = H / this.scene.height
			this.setContain()
		} else if (currentAspect >= 1.25) {
			this.scene.scale = H / this.scene.height
			this.setCover(W, H)
		} else {
			this.scene.scale = W / this.scene.width
			this.setContain()
		}
	}

	setContain() {
		this.viewport.width = this.scene.scale * this.scene.width
		this.viewport.height = this.scene.scale * this.scene.height
		this.viewport.offset.x = 0
		this.scene.offset.x = 0
	}

	setCover(W, H) {
		this.viewport.width = W
		this.viewport.height = H
		this.viewport.offset.x = this.scene.scale * this.scene.width - this.viewport.width
		this.scene.offset.x = this.scene.width - this.viewport.width / this.scene.scale
	}
}