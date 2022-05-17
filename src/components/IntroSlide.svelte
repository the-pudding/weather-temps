<script>
  import { fade } from "svelte/transition";
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Select from "$components/Select.svelte";
  import tapSvg from "$svg/tap.svg";

  export let active;
  export let alt;
  export let text;
  export let text2;
  export let text2_alt;
  export let loc;
  export let ready;
  export let prompt;

  $: response = alt ? text2_alt : text2;
</script>

<section class:active>
  {#if loc !== undefined}
    <div in:fade>
      <Slide>
        <div class="info">
          <p class="text">
            {text}
            <Select on:changeStation {loc} /> ?
          </p>
          <p class="text">{response}</p>
          <p class="subtext" class:ready>
            <span class="tap">{@html tapSvg}</span>
            {prompt} &rarr;
          </p>
        </div>
      </Slide>
    </div>
  {/if}
</section>

<style>
  section {
    opacity: 0;
    transition: opacity 1s 0.5s ease-in-out;
  }

  section.active {
    opacity: 1;
  }

  .info {
    margin-top: 8rem;
  }

  p:nth-of-type(n + 2) {
    color: var(--color-fg-alt);
  }

  .text {
    font-size: 36px;
  }

  .subtext {
    opacity: 0;
    transition: all 250ms;
  }

  .subtext.ready {
    opacity: 1;
  }

  :global(.tap svg) {
    display: inline-block;
    vertical-align: text-bottom;
    line-height: 1;
    margin-right: 0.25em;
    transform: translate(0, 0.25em);
  }

  @media only screen and (max-width: 640px) {
    p:nth-of-type(n + 2) {
      max-width: 260px;
    }

    .subtext {
      font-size: 18px;
    }
  }

  @media only screen and (max-width: 475px) {
    .text {
      font-size: 28px;
      line-height: 1.4;
    }
  }

  @media only screen and (max-width: 424px) {
    .text {
      font-size: 26px;
    }
  }

  @media only screen and (max-width: 374px) {
    .text {
      font-size: 24px;
    }
  }
</style>
