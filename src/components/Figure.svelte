<script>
  import { setContext, onMount, onDestroy, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { writable } from "svelte/store";
  import { max, extent } from "d3";
  import { activeSlide } from "$stores/misc";
  import FigureRecent from "$components/Figure.Recent.svelte";
  import FigureAnnual from "$components/Figure.Annual.svelte";
  import FigureHeatmap from "$components/Figure.Heatmap.svelte";
  import Title from "$components/Title.svelte";
  import { color } from "$data/variables.json";
  import mq from "$stores/mq.js";

  export let heatmapData;
  export let rawData;
  export let threshold;
  export let custom;

  const position = "absolute";
  const pad = 16;
  const padding = {
    top: pad * 2,
    right: pad * 1,
    bottom: pad * 3,
    left: pad * 1
  };
  const minDays = 4;
  const yExtent = extent(rawData, (d) => d.temp);
  // const yDomain = [Math.min(yExtent[0] - 1, 0), yExtent[1] + 1];
  const yDomain = [yExtent[0] - 5, yExtent[1] + 5];
  const dur = writable(2000);

  setContext("App", {
    rawData,
    heatmapData,
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
  let caption = {};

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
  $: titleHed =
    $activeSlide === 9
      ? `Number of times ${custom.location} set (or tied) a daily heat record`
      : custom.location;
  $: titleDek = $activeSlide === 9 ? "" : "Daily high temps.";
  $: {
    if ($activeSlide === 1) {
      caption.chart = "Scatter plot";
      caption.data = `recorded daily high temperatures for yesterday's date going back ${custom["count-oldest"]}`;
      caption.reason = "yesterday is ranked in context";
    } else if ($activeSlide === 2) {
      caption.chart = "Scatter plot";
      caption.data = `recorded daily high temperatures for the past ${custom["timespan-recent"]}`;
      caption.reason = "a recent near-record is in context";
    } else if ($activeSlide === 3) {
      caption.chart = "Scatter plot";
      caption.data = `recorded daily high temperatures for the past ${custom["timespan-recent"]}`;
      caption.reason = "daily record highs are depicted";
    } else if ($activeSlide < 7) {
      caption.chart = "Scatter plot";
      caption.data = `all-time daily high temperatures records for every day of the year`;
      caption.reason = "the hottest temperatures are seen at once";
    } else if ($activeSlide === 7) {
      caption.chart = "Scatter plot";
      caption.data = `recorded daily high temperatures for ${custom["date-example1"]} going back ${custom["count-oldest"]}`;
      caption.reason = "the record for that days is depicted";
    } else if ($activeSlide === 8) {
      caption.chart = "Scatter plot";
      caption.data = `recorded daily high temperatures for ${custom["date-example1"]} going back ${custom["count-oldest"]}`;
      caption.reason = "the previous record for that days is depicted";
    } else if ($activeSlide === 9) {
      caption.chart = "Heatmap";
      caption.data = `the number of records set or tied each month for the past 10 years`;
      caption.reason = "unusually hot months are depicted";
    } else {
      caption.chart = "";
      caption.data = "";
      caption.reason = "";
    }
  }
  $: figcaption = `${caption.chart} of ${caption.data} where ${caption.reason}`;

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
    {#if $activeSlide < 10}
      <Title hed={titleHed} dek={titleDek} />
    {/if}
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

    {#if $activeSlide === 9}
      <div>
        <FigureHeatmap />
      </div>
    {/if}
    <figcaption class="sr-only" aria-live="polite">{figcaption}</figcaption>
  </figure>
{/if}

<style>
  figure {
    --offset: 2rem;
    max-width: 960px;
    top: var(--offset);
    height: calc(60% - var(--offset));
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

  @media only screen and (min-width: 640px) {
    figure {
      height: calc(65% - var(--offset));
    }
  }
</style>
