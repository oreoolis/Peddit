<script setup>
import { ref, watch } from 'vue';
import { onUnmounted } from 'vue'
import Button from '../atoms/button.vue';
import searchBar from '../atoms/searchBar.vue';
import SelectAndOption from '../atoms/SelectAndOption.vue';
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:show', 'uploaded', 'error']);

const uploading = ref(false);

// // Reset when modal opens/closes
watch(() => props.show, (newVal) => {
    if (!newVal) {
        //resetForm();
    }
});


const closeModal = () => {
    if (!uploading.value) {
        emit('update:show', false);
    }
};
</script>

<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h5 class="modal-title primary">Add an Ingredient</h5>
                <Button label="X" outline color="danger" class="ms-auto" @click="closeModal"></Button>
            </div>
            <form>
                <div class="modal-body">
                    <!-- File Input -->
                    <div class="mb-3">
                        <label class="form-label headingFont fw-bold h5" for="inputGroupSelect01">Food Item</label>
                        <SelectAndOption defaultLabel="Select an option..."
                            :options="[
                                { value: 'beef', label: 'Beef Steak' },
                                { value: 'orange', label: 'Orange' },
                                { value: 'chicken', label: 'Chicken Breast' },
                            ]">
                        </SelectAndOption>
                    </div>
                    <div class="mb-3">
                        <span class="form-label headingFont fw-bold h5">Amount (in grams)</span>
                        <!-- can add v-model into the searchbar -->
                        <searchBar class="form-control" placeholder="Enter amount in grams" type="number"></searchBar>
                    </div>

                </div>

                <div class="modal-footer">
                    <Button type="submit" label="Submit" @click="closeModal">
                        <i class="bi bi-check-lg mx-1"></i>
                    </Button>
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
    background-color:white;
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