<script>
  import { ascending } from "d3";
  import { onMount, createEventDispatcher } from "svelte";
  import viewport from "$stores/viewport.js";
  import { selectY } from "$stores/misc.js";
  import stations from "$data/stations.csv";
  import distance from "$utils/distance.js";

  export let loc;

  const dispatch = createEventDispatcher();

  const coords = loc ? loc.split(",").map((d) => +d) : [40.7128, -74.006];

  const data = stations
    .map((d) => ({
      ...d,
      lat: +d.lat,
      lon: +d.lon
    }))
    .map((d) => ({
      ...d,
      dist: distance(coords[0], coords[1], d.lat, d.lon)
    }));

  data.sort((a, b) => ascending(a.dist, b.dist));
  const nearest = data[0].id;
  data.sort((a, b) => ascending(a.location, b.location));

  let value = data.findIndex((d) => d.id === nearest);
  let el;

  $: station = data[value];

  $: dispatch("changeStation", station);

  $: if (el && $viewport.width && $viewport.height)
    $selectY = el.getBoundingClientRect().top + el.offsetHeight + 16;

  onMount(() => {
    dispatch("changeStation", station);
  });
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
