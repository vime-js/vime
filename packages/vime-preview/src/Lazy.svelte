<div bind:this={el}>
	<slot {intersecting}></slot>
</div>

<script>
  // eslint-disable-next-line max-len
  // @see https://github.com/sveltejs/svelte/blob/master/site/src/components/IntersectionObserver.svelte

  import { onMount } from 'svelte';

  let el;
  let intersecting = false;
  
  export let container = null;
  export let threshold = 0.75;

  onMount(() => {
    const observedEl = container || el;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        intersecting = entries[0].isIntersecting;
        if (intersecting) observer.unobserve(observedEl);
      }, { threshold });

      observer.observe(observedEl);
      return () => observer.unobserve(observedEl);
    }

    function onScroll() {
      const rect = observedEl.getBoundingClientRect();

      intersecting = (
        rect.bottom > 0
      && rect.right > 0
      && (rect.top * (1 + threshold)) < window.innerHeight
      && rect.left < window.innerWidth
      );

      if (intersecting) window.removeEventListener('scroll', onScroll);
    }

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<style>
  div {
    width: 100%;
  }
</style>