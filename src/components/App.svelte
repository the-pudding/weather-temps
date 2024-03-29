<script>
  import { dev } from "$app/env";
  import { onMount, tick } from "svelte";
  import { fade } from "svelte/transition";
  import Slider from "$components/helpers/Slider.svelte";
  import Tap from "$components/helpers/Tap.svelte";
  import Progress from "$components/Progress.svelte";
  import Figure from "$components/Figure.svelte";
  import IntroSlide from "$components/IntroSlide.svelte";
  import OutroSlide1 from "$components/OutroSlide1.svelte";
  import OutroSlide2 from "$components/OutroSlide2.svelte";
  import ArticleSlide from "$components/ArticleSlide.svelte";
  import Header from "$components/Header.svelte";
  import Toggle from "$components/Toggle.svelte";
  import Table from "$components/Table.svelte";
  import copy from "$data/doc.json";
  import { activeSlide, dir, tableVisible } from "$stores/misc.js";
  import loadStationData from "$data/loadStationData.js";
  import locate from "$utils/locate.js";

  let stationId;
  let custom;
  let rawData;
  let heatmapData;
  let threshold;
  let slider = undefined;
  let loc = undefined;
  let disabled = [];
  let selectComponent;

  const onTap = ({ detail }) => {
    if ($tableVisible) return;
    if (detail === "right") slider.next();
    else slider.prev();
    $dir = detail;
  };

  const changeStation = async ({ detail }) => {
    disabled = ["left", "right"];
    rawData = undefined;
    const { station, jump } = detail;
    const { id, location, state_abbr, lat, lon } = station;
    const data = await loadStationData(id);
    data.custom.location = `${location}, ${state_abbr}`;
    custom = data.custom;
    rawData = data.rawData;
    threshold = data.threshold;
    heatmapData = data.heatmapData;

    if (selectComponent) selectComponent.setValue(id);

    await tick();
    stationId = id;
    if (jump) slider.jump(0);
    disabled = [];
  };

  // $: console.log({ stationId });

  $: yesterdayWasRecord = rawData
    ? rawData.find((d) => d.daysSinceNow === 1).rank === 0
    : false;

  $: showHeader = $activeSlide === 0;

  $: showToggle = $activeSlide === 6;

  $: toggleData = rawData
    ? rawData.filter((d) => d.highlight && d.highlight.includes("record5"))
    : [];

  onMount(async () => {
    try {
      const result = await locate(dev);
      loc = result.loc || false;
    } catch (err) {
      loc = false;
    }
  });
</script>

{#if rawData}
  {#key stationId}
    <Figure {custom} {rawData} {threshold} {heatmapData} />
  {/key}
{/if}

<article>
  <Slider bind:this={slider} bind:current={$activeSlide} duration="0">
    <IntroSlide
      {...copy.intro}
      {loc}
      active={$activeSlide === 0}
      alt={yesterdayWasRecord}
      ready={!!stationId}
      bind:selectComponent
      on:changeStation={changeStation}
    />

    {#each copy.slides as { slide, text, subtext, color }, i}
      {@const active = $activeSlide === +slide}
      {@const index = i + 1}
      <ArticleSlide {index} {active} {text} {subtext} {color} />
    {/each}

    <OutroSlide1
      {...copy.outro}
      method={copy.method}
      active={$activeSlide === 10}
      on:changeStation={changeStation}
    />

    <OutroSlide2 active={$activeSlide === 11} />
  </Slider>
</article>

<Tap
  debug={false}
  full={true}
  size="50%"
  enableKeyboard={true}
  marginTop={0}
  {disabled}
  on:tap={onTap}
/>

<Table />

{#if !showHeader}
  <Progress current={$activeSlide - 1} total={11} />
{/if}

{#if showHeader}
  <Header />
{/if}

{#if showToggle}
  <Toggle data={toggleData} location={custom.location} />
{/if}

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
    z-index: calc(var(--z-overlay) + 1);
    pointer-events: none;
  }
</style>
