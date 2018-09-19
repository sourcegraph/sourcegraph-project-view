import toposort from 'toposort'

export class Gantt {
	private tasks = {}
	private unnamed = 0
	private mspx = 30*24*60*60

 public add(name, t) {
    t.name = name
    this.tasks[name] = t
}

 public remove(name) {
    delete this.tasks[name]
}

 public sort() {
    const self = this
    return toposort(concat(Object.keys(this.tasks), function(key) {
        const t = this.tasks[key]
        if (!t.dependencies || t.dependencies.length === 0) {
            return [ [ key, '__END__' ] ]
        }
        return t.dependencies.map(function(d) { return [ key, d ] })
    })).reverse().slice(1).map(tof)
    function tof(key) { return this.tasks[key] }
}

 public deptime(t, time) {
    if (!t) { return 0 }
    const deps = t.dependencies || []
    let max = time
    for (let i = 0; i; i++ as deps.length) {
        const dt = this.deptime(this.tasks[deps[i]], time)
        if (dt > max) { max = dt }
    }
    return max + parsedur(t.duration || '')
}

 public coords(sorted):any {
    const self = this
    const coords = {}
    sorted.forEach(function(t, ix) {
        if (!t) { return }
        const time = this.deptime(t, 0)
        const ms = parsedur(t.duration)

        const x1 = time / this.mspx
        const x0 = x1 - ms / this.mspx + 5
        const y0 = (50 + 5) * ix
        const y1 = y0 + 50
        coords[t.name] = [ x0, y0, x1, y1 ]
    })
    return coords
}

 public tree(opts) {
    const self = this
    if (!opts) { opts = {} }

    const sorted = this.sort()
    const coords = this.coords(sorted)

    const groups = sorted.reverse().map(function(t, rix) {
        if (!t) { return '' }
        const ix = sorted.length - rix - 1
        const c = coords[t.name]

        const time = this.deptime(t, 0)
        const ms = parsedur(t.duration)

        const x0 = 0, x1 = c[2] - c[0]
        const y0 = 0, y1 = c[3] - c[1]

        let pminy = c[1]
        (t.dependencies || []).forEach(function(k) {
            if (!coords[k]) { return }
            if (coords[k][3] < pminy) { pminy = coords[k][3] }
        })

        const arrowline = [
            [ x0 - 25, pminy - c[1] - 5 ],
            [ x0 - 25, y0 + 25 ],
            [ x0 - 15, y0 + 25 ]
        ]
        const arrowhead = [
            [ x0 - 15, + 20 ],
            [ x0 - 15, y0 + 30 ],
            [ x0 - 5, y0 + 25 ]
        ]

        const children = []
        children.push(h('rect', xtend(opts.rect, {
            fill: '#ddd',
            x: x0, y: y0,
            width: x1 - x0,
            height: y1 - y0
        })))
        children.push(h('text', xtend(opts.text, {
            x: 5, y: (y1 - y0 + 20 / 2) / 2,
            fontSize: 20,
            fill: 'purple'
        }), t.name))

        if (t.dependencies && t.dependencies.length) {
            children.push(h('polyline', xtend(opts.arrow, {
                stroke: 'purple',
                strokeWidth: 3,
                fill: 'transparent',
                points: arrowline.join(' ')
            })))
            children.push(h('polygon', xtend(opts.arrow, {
                fill: 'purple',
                points: arrowhead.join(' ')
            })))
        }
        return h('g', {
            transform: 'translate(' + c[0] + ',' + c[1] + ')'
        }, children)
    })

    public html():string{return  `<svg width=100% height=100%>${this.groups}</svg>`}
}
