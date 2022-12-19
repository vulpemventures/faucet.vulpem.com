<script lang="typescript">
  import Field from './components/Field.svelte';
  import assets from './util/assets';
  import {requestAsset} from './util/api';
  import type {FaucetResponse} from './util/api';
  import loader from './util/loader';
  import {Html5Qrcode} from 'html5-qrcode'
  import {onMount} from 'svelte'

  let address: string;
  let asset: string;

  $: network = undefined;

  let faucetLoading = false;
  let faucetPromise: Promise<FaucetResponse>;

  function handleClick() {
    if (!address || address.length === 0) return;
    faucetPromise = loader(requestAsset({to: address, asset}), (loading) => {
      faucetLoading = loading;
    });
  }


  // QR code scanning
  let scanning = false
  let html5Qrcode

  onMount(init)

  function init() {
    html5Qrcode = new Html5Qrcode('reader')
  }

  function start() {
    html5Qrcode.start(
      {facingMode: 'environment'},
      {
        fps: 10,
        qrbox: {width: 250, height: 250},
      },
      onScanSuccess,
      onScanFailure
    )
    scanning = true
  }

  async function stop() {
    await html5Qrcode.stop()
    scanning = false
  }

  function onScanSuccess(decodedText) {
    address = decodedText
    stop()
  }

  function onScanFailure(error) {
    console.debug(`Code scan error = ${error}`)
  }
</script>

<section class="hero has-background-black-bis is-fullheight">
    <div class="hero-body">
        <div class="container is-max-desktop has-text-centered">
            <div class="mb-6">
                <h1 class="title has-text-white">🚰 Faucet</h1>
                <p class="subtitle is-6">Liquid Network Testnet</p>
            </div>

            <div class="field is-grouped is-grouped-centered">
                <Field labelFor="asset" label="Asset">
                    <div class="select is-primary">
                        <select id="asset" bind:value={asset}>
                            {#each assets as {name, id}}
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
                            class="input is-primary address"
                    />
                    {#if scanning}
                        <button on:click={stop} class="button is-primary">
                            Stop scanning
                        </button>
                    {:else}
                        <button on:click={start} class="button is-primary">
                            Scan QR Code
                        </button>
                    {/if}
                </Field>

            </div>

            <main>
                <reader id="reader"></reader>
            </main>

            <button
                    on:click={handleClick}
                    class:is-loading={faucetLoading}
                    class="button is-primary button__request"
            >
                Request
            </button>

            {#if (address && address.length > 0)}
                <div class="mt-4">
                    <a href={"http://twitter.com/intent/tweet?text=Requesting%20%40Liquid_BTC%20testnet%20funds%20to%20my%20%40MarinaWallet%20address%20%0A"+address}
                       target="_blank" rel="noreferrer">
                        <p class="has-text-white is-link">
                            Do you need more? 🐥 Tweet at your request
                        </p>
                    </a>
                </div>

            {/if}

            {#if faucetPromise}
                {#await faucetPromise then {txid}}
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

        </div>
    </div>


    <div class="hero-foot">
        <div class="container is-max-desktop">
            <div class="is-mobile is-half is-offset-one-third">
                <div class="column has-text-centered">
                    <p class="has-text-white">Made with ❤️ at Vulpem Ventures</p>
                </div>
            </div>
        </div>
    </div>
</section>

<style src="./scss/main.scss" lang="scss" global></style>