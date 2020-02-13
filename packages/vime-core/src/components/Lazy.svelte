<div bind:this={container}>
	<slot {intersecting}></slot>
</div>

<script>
  // eslint-disable-next-line max-len
  // @see https://github.com/sveltejs/svelte/blob/master/site/src/components/IntersectionObserver.svelte

  import { onMount } from 'svelte'
  
  let intersecting = false
  
  export let container
  export let threshold = 0.75

  onMount(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(entries => {
        intersecting = entries[0].isIntersecting
        if (intersecting) observer.unobserve(container)
      }, { threshold })

      observer.observe(container)
      return () => observer.unobserve(container)
    }

    function onScroll () {
      const rect = container.getBoundingClientRect()

      intersecting = (
        rect.bottom > 0 &&
        rect.right > 0 &&
        (rect.top * (1 + threshold)) < window.innerHeight &&
        rect.left < window.innerWidth
      )

      if (intersecting) window.removeEventListener('scroll', onScroll)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>