<script setup lang="ts">
import { computed } from 'vue'
import { useItemAddStore } from 'stores/item-add-store'

const ias = useItemAddStore()

const duplicateModifier = computed(() => [...ias.skills, ...ias.modifiers])
</script>
<template>
  <div class="fit">
    {{
      duplicateModifier
        .map((dm) => ({
          value: dm.value,
          label: dm.label,
          count: duplicateModifier
            .map((d) => d.label)
            .filter((d2) => d2 === dm.label).length
        }))
        .filter((f) => f.count > 1)
        .map((f) => JSON.stringify(f))
        .join('\n')
    }}
  </div>
</template>
