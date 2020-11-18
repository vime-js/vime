<script>
	import {onMount} from 'svelte';
	let vimePlayer;
	let vimeVideo;
	let vimeDefaultUi;

	onMount(async () => {
        const module = await import('@vime/svelte');
		vimePlayer = module.VimePlayer;
		vimeVideo = module.VimeVideo;
		vimeDefaultUi = module.VimeDefaultUi;
    });
</script>

<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Sapper Vimejs project template</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@vime/core@^4/themes/default.css"/>
</svelte:head>

<h1>Great success!</h1>

<!-- Notice we turned off controls? We're supplying our own, so we hide the native ones. -->
<svelte:component this={vimePlayer}>
  <svelte:component this={vimeVideo} crossOrigin="" poster="https://media.vimejs.com/poster.png">
    <source 
      data-src="https://media.vimejs.com/720p.mp4" 
      type="video/mp4" 
    />
    <track 
      default 
      kind="subtitles" 
      src="https://media.vimejs.com/subs/english.vtt" 
      srclang="en" 
      label="English" 
    />
  </svelte:component> 

  <!-- We've replaced the `<VimeUi />` component. -->
  <!-- We can turn off any features we don't want via properties. -->
  <svelte:component this={vimeDefaultUi} noClickToPlay>
    <!-- We can place our own UI components here to extend the default UI. -->
  </svelte:component>
</svelte:component>
