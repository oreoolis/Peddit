<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:show', 'uploaded', 'error']);
const uploading = ref(false);

const closeModal = () => {
    if (!uploading.value) {
        emit('update:show', false);
    }
}

</script>
<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h5 class="modal-title primary">Add an item to your shopping list</h5>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            <form>
                <div class="modal-body">
                    <!-- File Input -->
                    <div class="input-group mb-3">
                        <label class="input-group-text headingText" for="inputGroupSelect01">Food Item</label>
                        <input type="text" name="" id="" class="form-control bodyFont" placeholder="Frosty"
                            aria-describedby="helpId" />
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="closeModal">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
}

.modal-content {
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: between;
    align-items: center;
}

.modal-title {
    margin: 0;
    font-weight: 600;
}

.modal-body {
    padding: 1.5rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}
</style>