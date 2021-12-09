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

  let marina: MarinaProvider;
  let address: string;
  let network: string;

  let asset: string;

  let faucetLoading = false;
  let faucetPromise: Promise<FaucetResponse> | undefined;

  function handleClick() {
    faucetPromise = promiser(
      requestAsset({ to: address, asset }),
      (loading) => {
        faucetLoading = loading;
      }
    );
  }

  onMount(async () => {
    marina = await detectProvider('marina');
    address = (await marina.getNextAddress()).confidentialAddress;
    network = await marina.getNetwork();
  });
</script>

<section class="hero has-background-black-bis is-fullheight">
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right mt-3 mr-3">
      <Connect />
    </div>
  </div>

  {#if marina}
    <div class="hero-body">
      <div class="container is-max-desktop has-text-centered">
        <div class="field is-horizontal mb-3">
          <div class="field-label is-normal">
            <label for="asset" class="label has-text-white">Asset</label>
          </div>
          <div class="field-body">
            <div class="control">
              <div class="select is-primary">
                <select id="asset" bind:value={asset}>
                  {#each assets as { name, id }}
                    <option value={id}>{name}</option>
                  {/each}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal mb-4">
          <div class="field-label is-normal">
            <label for="address" class="label has-text-white">Address</label>
          </div>
          <div class="field-body">
            <div class="control">
              <input
                id="address"
                type="text"
                bind:value={address}
                placeholder="Liquid testnet address"
                class="input is-primary"
              />
            </div>
          </div>
        </div>

        <button
          on:click={handleClick}
          class="button is-primary"
          class:is-loading={faucetLoading}
        >
          Request
        </button>
      </div>
    </div>
  {/if}

  {#if faucetPromise}
    {#await faucetPromise}
      <p>Submitting...</p>
    {:then { txid }}
      <p>{txid}</p>
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
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
