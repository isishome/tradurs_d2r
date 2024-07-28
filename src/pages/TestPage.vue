<script setup lang="ts">
import { computed } from 'vue'
import { useItemAddStore } from 'stores/item-add-store'

const ias = useItemAddStore()

const filtered = computed(() =>
  ias
    .weapons()
    .map(
      (w, i) =>
        `${w.label
          .replace(/\s/gi, '')
          .replace(/'/gi, "''")
          .padEnd(
            20,
            'ㅤ'
          )}insert into weapons (order_id, weapon_id, weapon_type_id, image_weapon_id${
          w.distanceType ? ', distance_type' : ''
        }${w.classType ? ', class_type' : ''}) values (${i}, '${w.value}', '${
          w.itemType
        }', '000'${w.distanceType ? `, '${w.distanceType}'` : ''}${
          w.classType ? `, '${w.classType}'` : ''
        });`
    )
    .join('\n')
)

const filtered2 = computed(() =>
  ias
    .armor()
    .map(
      (a, i) =>
        `insert into armor (order_id, armor_id, armor_type_id, image_armor_id${
          a.classType ? ', class_type' : ''
        }) values (${i}, '${a.value}', '${a.itemType}', '000'${
          a.classType ? `, '${a.classType}'` : ''
        });`
    )
    .join('\n')
)
filtered
filtered2
</script>

<template>
  <div>
    <textarea class="fit" rows="100"> </textarea>
    <div>
      {{
        ias.base.data.runewordMappingWeapon
          .filter(
            (rmw) =>
              (!!!rmw.mappingId2 && !!!rmw.mappingId3 && !!!rmw.mappingId4) ||
              rmw.mappingId2 === 'swor'
          )
          .map((rmw) => rmw.mappingId1)
      }}
    </div>
    <br />
    <div>{{ ias.runewords('swor') }}</div>
  </div>
</template>
