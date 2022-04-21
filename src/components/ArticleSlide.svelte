<script>
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Select from "$components/Select.svelte";
  import tapSvg from "$svg/tap.svg";

  export let active;
  export let i;
  export let text;
  export let subtext;
  export let center;
  export let color;

  $: c = color ? `color-${color}` : "";
</script>

<section class:active>
  <Slide {center}>
    <div>
      <p class={c}>
        {@html text}
        {#if i === 0}<Select />{/if}
      </p>
      {#if subtext}
        <p>
          <small>
            {#if i === 0}<span class="tap">{@html tapSvg}</span>{/if}
            {@html subtext} &rarr;
          </small>
        </p>
      {/if}
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

  p {
    background: var(--color-bg);
    padding: 1rem;
    max-width: 65rem;
    margin: 0 auto;
  }

  p:last-of-type {
    padding-bottom: 4rem;
  }

  small {
    font-family: var(--font-form);
    color: var(--color-tertiary);
  }

  :global(.tap svg) {
    display: inline-block;
    vertical-align: text-bottom;
    line-height: 1;
  }
</style>
