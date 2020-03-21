<ul class="uk-list">
  {#each events as event}
    <li data-uk-scrollspy>
      <span class="uk-text-emphasis uk-text-small">
        {event.event}
        <span class="uk-text-muted uk-text-italic">
          (fired {event.timeAgo})
        </span>
        {#if showBadge(event)}
          <span class="uk-badge">new</span>
        {/if}
      </span> 
      <pre><code>{JSON.stringify(event.data, undefined, 2)}</code></pre>
    </li>
  {/each}
</ul>

<script>
  import { onDestroy } from 'svelte';
  import TimeAgo from 'javascript-time-ago';
  import en from 'javascript-time-ago/locale/en';
  import { canonical } from 'javascript-time-ago/gradation';

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo();

  let interval;

  export let events = [];

  const showBadge = (event) => (Date.now() - event.time) < 5000;

  const onStartInterval = () => {
    if (interval) window.clearInterval(interval);
    if (events.length === 0) return;
    const onInterval = () => {
      events.forEach((event, i) => {
        events[i].timeAgo = timeAgo.format(event.time, { gradation: canonical });
      });
    };
    onInterval();
    interval = setInterval(onInterval, 5000);
  };

  onDestroy(() => {
    window.clearInterval(interval);
  });

  $: onStartInterval(events);
</script>