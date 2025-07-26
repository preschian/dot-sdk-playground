<script setup lang="ts">
import { dot_people } from "@polkadot-api/descriptors";
import { Binary, createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";

const user = ref()

onMounted(async() => {
  const client = createClient(getWsProvider("wss://dot-rpc.stakeworld.io/people"));
  const api = client.getTypedApi(dot_people);

  const query = await api.query.Identity.IdentityOf.getValue('13KJ3t8w1CKMkXCmZ6s3VwdWo4h747kXE88ZNh6rCBTvojmM')

  const display = query?.info.display
  const identity = display?.type === 'Raw1' ? Binary.fromBytes(new Uint8Array(display.value)).asText() : display?.value?.asText()
  
  console.log(identity)
  user.value = identity
})

</script>

<template>
  <div>
    Hello, {{ user }}!
  </div>
</template>
