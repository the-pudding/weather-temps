<script>
  import { createEventDispatcher } from "svelte";
  import stations from "$data/stations.csv";

  const dispatch = createEventDispatcher();

  const data = stations.map((d) => ({
    ...d,
    lat: +d.lat,
    lon: +d.lon
  }));

  let value;

  $: station = data[value];

  $: dispatch("changeStation", station);
</script>

<select bind:value>
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
