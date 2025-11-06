import { defineStore } from "pinia";

export const useToastStore = defineStore('toast', {
    state: () => ({
        showOpSuccess: false,
        message: '',
        toastTimeout: null
    }),
    actions: {
        showToast(message, duration=3000){
            this.showOpSuccess = true;
            this.message = message;

            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }

            this.toastTimeout = setTimeout(() => {
                this.hideToast();
            }, duration);
        },
        hideToast() {
            this.showOpSuccess = false;
            this.message = '';
            if (this.toastTimeout) {
                clearTimeout(this.toastTimeout);
            }
        }
    }
})