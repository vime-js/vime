<ul class="uk-list uk-list-divider">
  {#each Object.keys(events) as event}
    <li>
      <span class="uk-text-emphasis uk-text-small">
        {event} 
        <span class="uk-text-muted uk-text-italic">
          (fired {events[event].timeAgo})
        </span>
      </span> 
      <pre><code>{JSON.stringify(events[event].detail)}</code></pre>
    </li>
  {/each}
</ul>

<script>
  import { onMount, onDestroy } from 'svelte';
  import TimeAgo from 'javascript-time-ago';
  import en from 'javascript-time-ago/locale/en';
  import { canonical } from 'javascript-time-ago/gradation';

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo();

  let interval;

  export let events = [];

  const onStartInterval = () => {
    if (interval) window.clearInterval(interval);
    const onInterval = () => {
      Object.keys(events).forEach(event => {
        events[event].timeAgo = timeAgo.format(events[event].time, { gradation: canonical });
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