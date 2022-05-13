<script>
  import { fade } from "svelte/transition";
  import Slider from "$components/helpers/Slider.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import Figure from "$components/Figure.svelte";
  import IntroSlide from "$components/IntroSlide.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import Header from "$components/Header.svelte";
  import copy from "$data/doc.json";
  import { activeSlide, dir } from "$stores/misc.js";
  import loadStationData from "$data/loadStationData.js";

  let stationId;
  let custom;
  let rawData;
  let threshold;
  let slider = undefined;

  const onTap = ({ detail }) => {
    if (detail === "right") slider.next();
    else slider.prev();
    $dir = detail;
  };

  const changeStation = async ({ detail }) => {
    const { id, location, state_abbr } = detail;
    const data = await loadStationData(id);
    stationId = id;
    data.custom.location = `${location}, ${state_abbr} area`;
    custom = data.custom;
    rawData = data.rawData;
    threshold = data.threshold;
  };
</script>

{#if rawData}
  {#key stationId}
    <Figure {stationId} {custom} {rawData} {threshold} />
  {/key}
{/if}

<article>
  <Slider bind:this={slider} bind:active={$activeSlide} duration="0">
    <IntroSlide
      {...copy.intro}
      active={$activeSlide === 0}
      on:changeStation={changeStation}
    />

    {#each copy.slides as { slide, text, subtext, color }}
      {@const active = $activeSlide === +slide}
      <ArticleSlide {active} {text} {subtext} {color} />
    {/each}
  </Slider>
</article>

{#if $activeSlide === 0}
  <Header />
{/if}
<Tap
  debug={false}
  full={true}
  size="50%"
  enableKeyboard={true}
  marginTop={$activeSlide === 0 ? 280 : 0}
  on:tap={onTap}
/>

<style>
  article,
  :global(figure) {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 50%;
    top: 0;
    transform: translate3d(-50%, 0, 0);
    padding: 1rem;
  }

  article {
    max-width: 60rem;
  }
</style>
