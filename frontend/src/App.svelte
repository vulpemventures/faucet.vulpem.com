<script lang="typescript">
  import { onMount } from 'svelte';
  import Connect from 'svelte-marina-button';
  import {
    AddressInterface,
    detectProvider,
    MarinaProvider,
  } from 'marina-provider';
  import assets from './assets';

  type SubmitResult = { txid: string };

  let marina: MarinaProvider | undefined;
  let address: AddressInterface | undefined;

  let selected: string;

  let submitResult: Promise<SubmitResult> | undefined;
  async function submit(args: {
    to: string;
    asset: string;
  }): Promise<SubmitResult> {
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    const result = await res.json();
    return result;
  }

  function handleClick() {
    submitResult = submit({ to: address.confidentialAddress, asset: selected });
  }

  onMount(async () => {
    marina = await detectProvider('marina');
    address = await marina.getNextAddress();
    console.log(address);
  });
</script>

<section class="hero has-background-black-bis is-fullheight">
  {#if marina}
    <div class="hero-head">
      <div class="container is-max-desktop has-text-right mt-3 mr-3">
        <Connect />
      </div>
    </div>

    <div class="hero-body">
      <div class="container is-max-desktop">
        <div class="select is-primary">
          <select bind:value={selected}>
            {#each assets as { name, id }}
              <option value={id}>{name}</option>
            {/each}
          </select>
          <button class="button is-primary" on:click={handleClick}>
            Submit
          </button>
        </div>
      </div>
    </div>

    {#if submitResult}
      {#await submitResult}
        <p>Submitting...</p>
      {:then { txid }}
        <p>{txid}</p>
      {:catch error}
        <p style="color: red">{error.message}</p>
      {/await}
    {/if}
  {:else}
    <!-- <p>Detecting provider...</p> -->
    <p style="color: red">Please install the Marina browser extension</p>
  {/if}

  <div class="hero-foot">
    <div class="container is-max-desktop">
      <div class="columns is-mobile is-half is-offset-one-third">
        <div class="column has-text-centered">
          Made with ❤️ at Vulpem Ventures
        </div>
      </div>
    </div>
  </div>
</section>

<style src="./scss/main.scss" lang="scss" global></style>
