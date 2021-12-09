<script lang="typescript">
  import { onMount } from 'svelte';
  import Connect from 'svelte-marina-button';
  import {
    AddressInterface,
    detectProvider,
    MarinaProvider,
  } from 'marina-provider';
  import assets from './assets';
  import { requestAsset } from './api';
  import type { FaucetResponse } from './api';
  import { promiser } from './util';

  let marina: MarinaProvider | undefined;
  let address: AddressInterface | undefined;

  let selected: string;

  let faucetLoading = false;
  let faucetPromise: Promise<FaucetResponse> | undefined;

  function handleClick() {
    faucetPromise = promiser(
      requestAsset({ to: address.confidentialAddress, asset: selected }),
      (loading) => {
        faucetLoading = loading;
      }
    );
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
          <button
            class="button is-primary"
            class:is-loading={faucetLoading}
            on:click={handleClick}
          >
            Request
          </button>
        </div>
      </div>
    </div>

    {#if faucetPromise}
      {#await faucetPromise}
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
