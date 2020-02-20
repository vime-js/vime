export default function aspectRatio (node, aspectRatio) {
  const update = aspectRatio => {
    if (!aspectRatio) {
      node.style.paddingBottom = null
      return
    }
    const [width, height] = aspectRatio.split(':')
    node.style.paddingBottom = `${(100 / width) * height}%`
  }

  update(aspectRatio)
  node.style.background = '#000'
  node.style.position = 'relative'

  return {
    update,
    destroy () { 
      update(null) 
      node.style.background = null
      node.style.position = null
    }
  }
}
