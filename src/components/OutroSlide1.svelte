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
      <Select on:changeStation jump={true} />
    </p>
    <p class="subtext">{@html by}</p>
    <p class="subtext">{@html support}</p>
    <p class="button-wrapper">
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

  .button-wrapper {
    margin-top: 0;
  }

  details {
    font-family: var(--sans);
    font-size: 1.2rem;
    margin-top: 3rem;
  }

  details p {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  details p:nth-of-type(1) {
    border: none;
    line-height: 1.4;
    padding: 0;
  }

  .btn {
    font-family: var(--sans);
    border-radius: 3px;
    font-size: 1.2rem;
    text-decoration: none;
    padding: .3rem .6rem;
    background-color: var(--color-gray-800);
    color: var(--color-fg-alt);
    z-index: calc(var(--z-overlay) + 1);
    margin-top: -1rem;
  }


  p:nth-of-type(1) {
    line-height: 2;
    border-bottom: 2px solid rgba(255,255,255,.4);
    padding-bottom: 2rem;
  }

  @media only screen and (max-width: 640px) {
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
