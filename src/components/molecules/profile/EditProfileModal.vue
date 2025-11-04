<script setup>
import { reactive, watch, ref } from 'vue';

const props = defineProps({
  show: { type: Boolean, default: false },
  initialDisplayName: { type: String, default: '' },
  initialBio: { type: String, default: '' }
});

const emit = defineEmits(['update:show', 'save']);

const form = reactive({ display_name: '', bio: '' });
const saving = ref(false);
const error = ref('');
let saveTimer = null;

watch(() => props.show, (v) => {
  if (v) {
    form.display_name = props.initialDisplayName || '';
    form.bio = props.initialBio || '';
    error.value = '';
    saving.value = false;
  }
});

const close = () => {
  if (!saving.value) emit('update:show', false);
};

const save = async () => {
  try {
    error.value = '';
    saving.value = true;
    
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      if (saving.value) {
        error.value = 'Saving is taking longer than expected. Please try again.';
        saving.value = false;
      }
    }, 10000);

    // emit values up; parent will call store and handle via callbacks
    emit('save', { display_name: form.display_name?.trim() || null, bio: form.bio?.trim() || null }, done, fail);
  } catch (e) {
    error.value = e?.message || 'Failed to save';
    saving.value = false;
  }
};

// parent callbacks to conclude modal state
const done = () => {
  clearTimeout(saveTimer);
  saving.value = false;
  emit('update:show', false);
};
const fail = (msg) => {
  clearTimeout(saveTimer);
  saving.value = false;
  error.value = msg || 'Failed to save';
};
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="close">
    <div class="modal-content bg-white" @click.stop>
      <div class="modal-header d-flex">
        <h5 class="modal-title primary">Edit Profile</h5>
        <button type="button" class="btn-close ms-auto" @click="close"></button>
      </div>

      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label">Display name</label>
          <input
            v-model="form.display_name"
            type="text"
            class="form-control"
            :maxlength="50"
            placeholder="Your display name"
          />
          <div class="form-text">Shown on your profile</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Bio</label>
          <textarea
            v-model="form.bio"
            class="form-control"
            rows="4"
            :maxlength="280"
            placeholder="Tell people about you and your pets…"
          />
          <div class="form-text">Max 280 characters</div>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
      </div>

      <div class="modal-footer">
        <button class="btn bg-primary white" @click="save" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          Save changes
        </button>
        <button class="btn btn-secondary" @click="close" :disabled="saving">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  width: min(560px, 92vw);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e4e4e7;
}

.modal-body { padding: 16px 20px; }
.modal-footer {
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid #f2f2f3;
}
</style>
