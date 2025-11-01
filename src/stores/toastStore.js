import { defineStore } from "pinia";

export const useToastStore = defineStore('toast', {
    state: () => ({
        showOpSuccess: false,
        message: ''
    }),
    actions: {
        showToast(message){
            this.showOpSuccess = true;
            this.message = message;
        },
        hideToast() {
            this.showOpSuccess = false;
            this.message = '';
        }
    }
})