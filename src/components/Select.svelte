<script>
  import { groups, ascending } from "d3";
  import { onMount, createEventDispatcher } from "svelte";
  import viewport from "$stores/viewport.js";
  import distance from "$utils/distance.js";
  import stations from "$data/stations.csv";
  import stateData from "$data/us-states.json";

  export let loc;
  export let jump;
  export const setValue = (id) => {
    value = id;
  };

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

  let value = jump ? "" : data.find((d) => d.id === nearest).id;
  let el;

  $: station = data.find((d) => d.id === value);
  $: city = station ? station.location : "choose a city";

  $: if (station) dispatch("changeStation", { station, jump });

  // $: if (el && $viewport.width && $viewport.height)
  //   $selectY = el.getBoundingClientRect().top + el.offsetHeight + 16;

  $: pad = city.length < 11 ? 4 : city.length < 14 ? 3 : 2;
  $: width = `${city.length + pad}ch`;

  onMount(() => {
    if (!jump) dispatch("changeStation", { station, jump });
  });
</script>

<select aria-label="select a city" bind:value bind:this={el} style:width>
  {#if jump}
    <option value="">Choose a city</option>
  {/if}
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
    pointer-events: all;
  }

  @media only screen and (min-width: 640px) {
    select {
      font-size: 0.85em;
      margin-left: 0.25em;
    }
  }

  @media only screen and (max-width: 475px) {
    select {
      font-size: 22px;
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 424px) {
    select {
      font-size: 18px;
    }
  }

  @media only screen and (max-width: 374px) {
    select {
      font-size: 16px;
    }
  }
</style>
