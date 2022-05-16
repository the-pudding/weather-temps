<script>
  import { setContext, onMount, onDestroy, tick } from "svelte";
  import { writable } from "svelte/store";
  import { max, extent } from "d3";
  import { fade } from "svelte/transition";
  import { activeSlide } from "$stores/misc";
  import FigureRecent from "$components/Figure.Recent.svelte";
  import FigureAnnual from "$components/Figure.Annual.svelte";
  import Title from "$components/Title.svelte";
  import { color } from "$data/variables.json";
  import mq from "$stores/mq.js";

  export let stationId;
  export let rawData;
  export let threshold;
  export let custom;

  const position = "absolute";
  const pad = 16;
  const padding = {
    top: pad * 2,
    right: pad * 1.5,
    bottom: pad * 3,
    left: pad * 1
  };
  const minDays = 4;
  const yExtent = extent(rawData, (d) => d.temp);
  // const yDomain = [Math.min(yExtent[0] - 1, 0), yExtent[1] + 1];
  const yDomain = [yExtent[0] - 5, yExtent[1] + 5];
  const dur = writable(2000);

  console.log({ stationId });

  setContext("App", {
    rawData,
    threshold,
    custom,
    minDays,
    position,
    pad,
    padding,
    yDomain,
    dur,
    color: {
      primary: color.green,
      secondary: color.pink,
      tertiary: color.blue,
      default: color.transparent,
      primaryT: color["green-transparent"],
      secondaryT: color["pink-transparent"],
      tertiaryT: color["blue-transparent"]
    }
  });

  let mounted = false;
  let width = 0;
  let height = 0;

  const insertCustomText = () => {
    Object.keys(custom).forEach((key) => {
      const text = custom[key];
      [...document.querySelectorAll(`.c-${key}`)].forEach(
        (el) => (el.innerText = text)
      );
    });
  };

  $: tease = $activeSlide === 0;
  $: $dur = $mq.reducedMotion ? 0 : 2000;

  onMount(async () => {
    await tick();
    mounted = true;
    insertCustomText();
  });

  onDestroy(() => {
    mounted = false;
  });
</script>

{#if mounted}
  <figure class:tease bind:clientWidth={width} bind:offsetHeight={height}>
    <Title hed={custom.location} dek="Daily High Temps." />
    {#if $activeSlide < 9}
      <div out:fade={{ duration: 0 }}>
        <FigureRecent {width} {height} />
      </div>
    {/if}
    {#if $activeSlide >= 3 && $activeSlide < 9}
      <div out:fade={{ duration: 0 }}>
        <FigureAnnual {width} {height} />
      </div>
    {/if}
  </figure>
{/if}

<style>
  figure {
    max-width: 960px;
    height: 75%;
    top: 0;
    overflow: hidden;
    transition: transform 1s ease-in-out, filter 0.5s 1s;
  }

  figure.tease {
    filter: blur(4px);
    transform: translate3d(-50%, 50%, 0);
  }

  figure div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
