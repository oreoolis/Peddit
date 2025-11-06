<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    showOpSuccess: {
        type: Boolean,
        required: true,
        default: false
    }
})

const toastElement = ref('');

onMounted(() => {
    if (props.showOpSuccess && toastElement.value){
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement.value, {autohide: true, delay: 3000});
        toastBootstrap.show()
    }
        
})

</script>
<template>
    <!-- Toast Message -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div ref="toastElement" id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-success">
                <strong class="me-auto text-light">Peddit</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body" id="message">
                {{ props.message }}
            </div>
        </div>
    </div>
</template>
<style scoped>
#message{
    font-weight: bold;
}
</style>