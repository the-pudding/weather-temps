<script>
  import Header from "$components/Header.svelte";
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Select from "$components/Select.svelte";
  import tapSvg from "$svg/tap.svg";

  export let active;
  export let text;
  export let text2;
  export let text_alt;
  export let text2_alt;
  export let prompt;
</script>

<section class:active>
  <Header />
  <Slide>
    <div>
      <p class="text">{text} <Select /></p>
      <p class="text">{text2}</p>
      <p class="subtext">
        <span class="tap">{@html tapSvg}</span>
        {prompt} &rarr;
      </p>
    </div>
  </Slide>
</section>

<style>
  section {
    opacity: 0;
    transition: opacity 1s 0.5s ease-in-out;
  }

  section.active {
    opacity: 1;
  }

  div {
    margin-top: 2rem;
  }

  p:nth-of-type(n + 2) {
    color: var(--color-fg-alt);
  }

  :global(.tap svg) {
    display: inline-block;
    vertical-align: text-bottom;
    line-height: 1;
  }
</style>
