<script>
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Select from "$components/Select.svelte";

  export let i;
  export let active;
  export let center;
  export let text;
  export let subtext;
</script>

<section class:active>
  <Slide {center}>
    <div>
      <p>
        {@html text}
        {#if i === 0}<Select />{/if}
      </p>
      {#if subtext}
        <p><small>{@html subtext} &rarr;</small></p>
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
    margin: 0;
  }

  p:last-of-type {
    padding-bottom: 4rem;
  }

  small {
    font-family: var(--font-form);
    color: var(--color-tertiary);
  }
</style>
