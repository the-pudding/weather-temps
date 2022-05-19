<script>
  export let hed;
  export let dek;
</script>

<div>
  <p class="hed">{hed}</p>
  {#if dek}<p class="dek">{dek}</p>{/if}
</div>

<style>
  div {
    margin-top: 2rem;
    padding: 0;
    font-family: var(--sans);
    text-transform: uppercase;
    transform: translate(0, -100%);
  }

  p {
    font-size: 0.9em;
    margin: 0;
  }

  .hed {
    color: var(--color-fg-alt);
  }

  @media only screen and (min-width: 640px) {
    div {
      padding: 0 1rem;
    }

    p {
      font-size: 1em;
    }
  }
</style>
