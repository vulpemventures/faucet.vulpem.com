<script lang="typescript">
  import { onDestroy, onMount } from 'svelte';
  import Connect, { marinaStore, MarinaStore } from 'svelte-marina-button';
  import { MarinaProvider } from 'marina-provider';
  import Field from './components/Field.svelte';
  import assets from './util/assets';
  import { requestAsset } from './util/api';
  import type { FaucetResponse } from './util/api';
  import loader from './util/loader';

  enum ButtonMessage {
    INSTALL = "Marina is not installed",
    ENABLE = "Connect with Marina",
    WRONG_NETWORK = "Wrong network, switch to the Testnet",
    REQUEST = "Request",
  }

 
  let address: string;
  let asset: string;

  $: installed = false;
  $: enabled = false;
  $: network = undefined;

  let faucetLoading = false;
  let faucetPromise: Promise<FaucetResponse>;

  function handleClick() {
    faucetPromise = loader(requestAsset({ to: address, asset }), (loading) => {
      faucetLoading = loading;
    });
  }

  const unsubscribe = marinaStore.subscribe((s: MarinaStore) => {
    installed = s.installed;
    enabled = s.enabled;
    network = s.network;
    console.log(s);
  });

  $: buttonMessage = 
    !installed ? 
    ButtonMessage.INSTALL : 
    (!enabled ? 
      ButtonMessage.ENABLE : 
      (network !== 'testnet' ? 
        ButtonMessage.WRONG_NETWORK : 
        ButtonMessage.REQUEST
      )
    ); 

  onDestroy(() => {
    unsubscribe();
  });
</script>

<section class="hero has-background-black-bis is-fullheight">
  <div class="hero-head">
    <div class="container is-max-desktop has-text-right mt-3 mr-3">
      <Connect />
    </div>
  </div>

    <div class="hero-body">
      <div class="container is-max-desktop has-text-centered">
        {#if buttonMessage === ButtonMessage.REQUEST}
          <Field labelFor="asset" label="Asset">
            <div class="select is-primary">
              <select id="asset" bind:value={asset}>
                {#each assets as { name, id }}
                  <option value={id}>{name}</option>
                {/each}
              </select>
            </div>
          </Field>

          <Field labelFor="address" label="Address">
            <input
              id="address"
              type="text"
              bind:value={address}
              placeholder="Liquid testnet address"
              class="input is-primary"
            />
          </Field>

          <button
            on:click={handleClick}
            class:is-loading={faucetLoading}
            disabled={address === ''}
            class="button is-primary"
          >
            {buttonMessage}
          </button>

          {#if faucetPromise}
            {#await faucetPromise then { txid }}
              <div class="mt-2">
                <p class="has-text-white">
                  Transaction ID:
                  <a
                    href="https://blockstream.info/liquidtestnet/tx/{txid}"
                    target="_blank"
                    rel="noreferrer"
                    class="is-family-code"
                  >
                    {txid}
                  </a>
                </p>
              </div>
            {:catch error}
              <p class="has-text-danger mt-2">
                {error?.message ?? 'Unknown Error'}
              </p>
            {/await}
          {/if}
        {:else}
          <p class="has-text-white">
            {buttonMessage}
          </p>
        {/if}
      </div>
    </div>


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
