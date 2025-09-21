<script setup lang="ts">
import { ref, watch } from 'vue'
import { Drawer, NewAppointment } from '@/components'
import { CheckIcon, RejectIcon, UserIcon } from '@/assets'
import type { PatientInformation } from '@/types'

const props = defineProps<{
  patient: PatientInformation | null
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const showModal = ref(props.modelValue)

watch(() => props.modelValue, (val) => (showModal.value = val))
watch(showModal, (val) => emit('update:modelValue', val))

const displayObjects = <T>(
  list: T[] | null | undefined,
  formatter: (item: T) => string
): string => {
  return list && list.length > 0 ? list.map(formatter).join(', ') : 'None'
}
</script>

<template>
  <Drawer v-model="showModal">
    <div v-if="props.patient" class="bg-purple-50 rounded-lg m-4 relative">
      <div class="flex items-center gap-4 mb-4">
        <UserIcon class="w-15 h-auto" />
        <div>
          <p class="font-semibold text-lg">
            {{ props.patient.name.first }} {{ props.patient.name.last }}
          </p>
          <p class="text-sm text-gray-600">{{ props.patient.dob }}</p>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="my-3 text-sm grid grid-cols-2 text-center">
        <div>
          <p class="col-span-2">{{ props.patient.address }}</p>
        </div>
        <div>
          <p class="col-span-2">{{ props.patient.insurance_num }}</p>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-y-2 text-sm">
        <p>{{ props.patient.height }} in</p>
        <p class="text-center">{{ props.patient.weight }} lbs</p>
        <p class="text-right">{{ props.patient.blood }}</p>
      </div>

      <div class="my-3 text-sm grid grid-cols-2 text-center">
        <div>
          <span class="font-medium block mb-1">Employed?</span>
          <component :is="props.patient.employed ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
            :class="props.patient.employed ? 'text-green-600' : 'text-red-600'" aria-hidden="true" />
          <span class="sr-only">
            {{ props.patient.employed ? 'Employed' : 'Not employed' }}
          </span>
        </div>

        <div>
          <span class="font-medium block mb-1">Insured?</span>
          <component :is="props.patient.insured ? CheckIcon : RejectIcon" class="w-6 h-6 mx-auto"
            :class="props.patient.insured ? 'text-green-600' : 'text-red-600'" aria-hidden="true" />
          <span class="sr-only">
            {{ props.patient.insured ? 'Insured' : 'Not insured' }}
          </span>
        </div>
      </div>

      <hr class="my-3 border-gray-300" />

      <div class="space-y-1 text-sm">
        <p>
          <strong>Allergies:</strong>
          {{displayObjects(props.patient.allergies, a => `${a.name} (${a.reactions})`)}}
        </p>

        <p>
          <strong>Medications:</strong>
          {{displayObjects(props.patient.medications, m => `${m.name} (${m.purpose})`)}}
        </p>

        <p>
          <strong>History:</strong>
          {{displayObjects(props.patient.history, h => `${h.disease} (Carrier: ${h.carrier})`)}}
        </p>

        <p>
          <strong>ICD Codes:</strong>
          {{displayObjects(props.patient.icdcodes, i => i.code)}}
        </p>
      </div>

            <hr class="my-3 border-gray-300" />

            <div class="flex justify-center">
              <NewAppointment />
</div>
    </div>
  </Drawer>
</template>
