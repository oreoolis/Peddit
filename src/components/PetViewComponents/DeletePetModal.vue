<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { usePetStore } from '@/stores/petStore';
import { usePetNutritionStore } from '@/stores/petNutritionStore';

const petStore = usePetStore();
const emit = defineEmits(['update:show'])
const router = useRouter();

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: ''
    },
    id: {
        type: String,
        default: ''
    }
})

const view = ref(false);
const closeModal = () => {
    if (!view.value) {
        emit('update:show', false);
    }
};

const deleteItem = async () => {
    try {
        const res = await petStore.deletePet(props.id);
        if (!res.success) {
            throw new Error(res.error);
        }
        alert(props.name + " has been successfully deleted");
        router.push('/pet');
        closeModal();
    } catch (error) {
        alert("Error deleting " + props.name + ". Please try again.")
    }
}


</script>
<template>
    <div v-if="show" class="modal-backdrop" @click="closeModal">
        <div class="modal-content bg-white" @click.stop>
            <div class="modal-header d-flex">
                <h2 class="modal-title danger headingFont">Warning!</h2>
                <button type="button" class="btn-close ms-auto" @click="closeModal"></button>
            </div>
            <form>
                <div class="modal-body ">
                    <div class="headingFont fw-semibold text-center">
                        <h4>You will be deleting <b>{{ props.name }}</b>.</h4>
                        <h4>Are you sure?</h4>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-danger bodyFont fw-bold" @click="deleteItem">
                        Proceed
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