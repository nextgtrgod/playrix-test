import * as PIXI from 'pixi.js'
import Stairs from './Stairs.js'

const objects = [
	{
		name: 'floor',
		anchor: [1, 1],
		position: [1390, 640],
	},
	{
		name: 'bookStand',
		position: [834, -28],
	},
	{
		name: 'plantBackA',
		resource: 'plantBack',
		position: [456, -42],
	},
	{
		name: 'plantBackB',
		resource: 'plantBack',
		position: [1135, 164],
	},
	{
		name: 'globe',
		position: [87, 109],
	},
	{
		name: 'table',
		position: [202, 196],
	},
	{
		name: 'couch',
		anchor: [0, 0],
		position: [127, 324],
	},
	{
		name: 'austin',
		position: [696, 113],
	},
	{
		name: 'plantFront',
		position: [1122, 438],
	},
]

export default class Environment {
	constructor() {
		this.loader = PIXI.Loader.shared
		this.container = new PIXI.Container()

		this.setObjects()
	}

	setObjects() {
		this.objects = {}
		objects.forEach(({ name, resource, anchor, position }) => {
			this.objects[name] = new PIXI.Sprite( this.loader.resources[resource || name].texture )
			if (anchor) this.objects[name].anchor.set(...anchor)
			this.objects[name].position.set(...position) 

			this.container.addChild(this.objects[name])
		})

		this.stairs = new Stairs()
		const index = this.container.getChildIndex(this.objects['plantFront'])
		this.container.addChildAt(this.stairs.container, index)
	}
}