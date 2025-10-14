<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { PatientInformation } from '@/types'
import ListEditor from './ListEditor.vue'

const props = defineProps<{
  patient: PatientInformation
}>()
const emit = defineEmits<{
  (e: 'save', patient: PatientInformation): void
  (e: 'cancel'): void
}>()

const local = reactive(JSON.parse(JSON.stringify(props.patient || {})) as PatientInformation)

const localDob = computed({
  get() {
    if (!local.dob) return ''
    const d = local.dob instanceof Date ? local.dob : new Date(local.dob)
    const year = d.getFullYear()
    const month = String(d.getMonth()+1).padStart(2,'0')
    const day = String(d.getDate()).padStart(2,'0')
    return `${year}-${month}-${day}`
  },
  set(val: string) {
    if (!val) { local.dob = undefined as any; return }
    const [y,m,d] = val.split('-').map(Number)
    local.dob = new Date(y,m-1,d)
  }
})

function onSave() {
  local.allergies = (local.allergies || []).filter((a:any) => a.name || a.reactions)
  local.medications = (local.medications || []).filter((m:any) => m.name || m.purpose)
  local.history = (local.history || []).filter((h:any) => h.disease || h.carrier)
  local.icdcodes = (local.icdcodes || []).filter((i:any) => i.code)

  emit('save', JSON.parse(JSON.stringify(local)))
}

function onCancel() {
  emit('cancel')
}

defineExpose({ onSave, onCancel })
</script>

<template>
  <div class="p-2 bg-white rounded">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium">First name</label>
        <input v-model="local.name.first" class="border p-1 rounded w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Last name</label>
        <input v-model="local.name.last" class="border p-1 rounded w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">DOB</label>
        <input v-model="localDob" type="date" class="border p-1 rounded w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Address</label>
        <input v-model="local.address" class="border p-1 rounded w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Insurance #</label>
        <input v-model="local.insurance_num" class="border p-1 rounded w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium">Blood</label>
        <input v-model="local.blood" class="border p-1 rounded w-full" />
      </div>
    </div>

    <hr class="my-3" />

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="flex items-center gap-3">
        <span>Employed?</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="local.employed" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
      <div class="flex items-center gap-3">
        <span>Insured?</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="local.insured" class="sr-only peer" />
          <div class="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
          <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>
    </div>

    <hr class="my-3" />

    <ListEditor
      label="Allergies"
      :items.sync="local.allergies"
      :fields="['name','reactions']"
    />
    <ListEditor
      label="Medications"
      :items.sync="local.medications"
      :fields="['name','purpose']"
    />
    <ListEditor
      label="History"
      :items.sync="local.history"
      :fields="['disease','carrier']"
    />
    <ListEditor
      label="ICD Codes"
      :items.sync="local.icdcodes"
      :fields="['code']"
    />
  </div>
</template>
