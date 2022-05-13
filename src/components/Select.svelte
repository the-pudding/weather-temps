<script>
  import { createEventDispatcher } from "svelte";
  import viewport from "$stores/viewport.js";
  import { selectY } from "$stores/misc.js";
  import stations from "$data/stations.csv";

  const dispatch = createEventDispatcher();

  const data = stations.map((d) => ({
    ...d,
    lat: +d.lat,
    lon: +d.lon
  }));

  let value;
  let el;

  $: station = data[value];

  $: dispatch("changeStation", station);

  $: if (el && $viewport.width && $viewport.height)
    $selectY = el.getBoundingClientRect().top + el.offsetHeight + 16;
</script>

<select bind:value bind:this={el}>
  {#each data as { id, state_abbr, location, lat, lon }, i}
    <option value={i}>{location}, {state_abbr}</option>
  {/each}
</select>

<style>
  select {
    position: relative;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    margin-left: 0.25em;
    background-color: var(--color-gray-800);
    color: var(--color-fg-alt);
    font-size: 0.85em;
    z-index: calc(var(--z-overlay) + 1);
  }
</style>
