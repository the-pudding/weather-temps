<script>
  import { groups, ascending } from "d3";
  import { onMount, createEventDispatcher } from "svelte";
  import viewport from "$stores/viewport.js";
  import { selectY } from "$stores/misc.js";
  import distance from "$utils/distance.js";
  import stations from "$data/stations.csv";
  import stateData from "$data/us-states.json";

  export let loc;

  const dispatch = createEventDispatcher();

  const getName = (abbr) => {
    const match = stateData.find((d) => d.abbr === abbr);
    return match ? match.name : abbr;
  };

  const coords = loc ? loc.split(",").map((d) => +d) : [40.7128, -74.006];

  const data = stations
    .map((d) => ({
      ...d,
      lat: +d.lat,
      lon: +d.lon,
      location: d.name || d.location
    }))
    .map((d) => ({
      ...d,
      dist: distance(coords[0], coords[1], d.lat, d.lon)
    }))
    .filter((d) => d.remove !== "TRUE");

  data.sort((a, b) => ascending(a.dist, b.dist));
  const nearest = data[0].id;
  data.sort((a, b) => ascending(a.location, b.location));

  const grouped = groups(data, (d) => d.state_abbr);
  grouped.sort((a, b) => ascending(a[0], b[0]));

  let value = data.find((d) => d.id === nearest).id;
  let el;

  $: station = data.find((d) => d.id === value);
  $: city = station.location;

  $: dispatch("changeStation", station);

  $: if (el && $viewport.width && $viewport.height)
    $selectY = el.getBoundingClientRect().top + el.offsetHeight + 16;

  $: width = `${city.length + 3}ch`;

  onMount(() => {
    dispatch("changeStation", station);
  });
</script>

<select bind:value bind:this={el} style:width>
  {#each grouped as [abbr, cities]}
    <optgroup label={getName(abbr)}>
      {#each cities as { id, state_abbr, location, lat, lon }}
        <option value={id}>{location}</option>
      {/each}
    </optgroup>
  {/each}
</select>

<style>
  select {
    position: relative;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    background-color: var(--color-gray-800);
    color: var(--color-fg-alt);
    z-index: calc(var(--z-overlay) + 1);
    margin-left: 0;
    font-size: 0.8em;
  }

  @media only screen and (min-width: 640px) {
    select {
      font-size: 0.85em;
      margin-left: 0.25em;
    }
  }
</style>
