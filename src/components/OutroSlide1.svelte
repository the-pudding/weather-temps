<script>
  import Slide from "$components/helpers/Slider.Slide.svelte";
  import Select from "$components/Select.svelte";

  export let active;
  export let prompt;
  export let by;
  export let support;
  export let method;
</script>

<section class:active class="outro">
  <Slide>
    <p class="subtext">
      {prompt}
      <Select on:changeStation jump={true} /> ?
    </p>
    <p class="subtext">{@html by}</p>
    <p class="subtext">{@html support}</p>
    <p>
      <a class="btn" href="https://patreon.com/thepudding" target="_blank"
        >Become a Patron</a
      >
    </p>
    <div>
      <details>
        <summary>Data and Methods</summary>
        <div>
          {#each method as { value }}
            <p>{@html value}</p>
          {/each}
        </div>
      </details>
    </div>
  </Slide>
</section>

<style>
  section {
    opacity: 0;
  }

  section.active {
    opacity: 1;
  }

  :global(.outro a, .outro details) {
    cursor: pointer;
    pointer-events: all;
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
