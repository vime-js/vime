import { raf, get_current_component } from 'svelte/internal'
import { onDestroy } from 'svelte'
import { is_function } from '~utils/unit'

export default class Scheduler {
  constructor (name) {
    this._raf = null
    this._tasks = {}
    this._registry = new Set()
    this._name = name + 'Scheduler'
    if (get_current_component()) onDestroy(() => this.destroy())
  }

  name () { return this._name }

  has (id) { return this._registry.has(id) }

  add (id, run) {
    if (!id || !run) this._error(`attempted to schedule invalid task [${id}]`)
    if (this.has(id)) this._error(`attempted to register task with \`id\` [${id}] but it is taken`)
    this._registry.add(id)
    this._tasks[id] = { run }
    if (get_current_component()) onDestroy(() => this.remove(id))
  }

  remove (id) {
    delete this._tasks[id]
    this._registry.delete(id)
  }

  pause (id, isPaused) {
    const task = this._tasks[id]
    if (!task) return
    task.isPaused = isPaused
  }

  stop () { window.cancelAnimationFrame(this._raf) }

  start () {
    this.stop()
    Object.values(this._tasks).forEach(task => { if (!task.isPaused) task.run() })
    this._raf = raf(() => this.start())
  }

  _error (msg) {
    throw Error(`${this._name} :: ${msg}`)
  }

  destroy () {
    this.stop()
    this._raf = null
    this._tasks = {}
  }
}
