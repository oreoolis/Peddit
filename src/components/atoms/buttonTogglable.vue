<script setup>
const props = defineProps({
    iconLinkON: {
        type: String,
        default: "bi-emoji-sunglasses-fill"
    },
    labelON:{
        type:String,
        default: "Turn On"
    },
    colorON:{
        type:String,
        default: 'primary'
    },
    iconLinkOFF: {
        type: String,
        default: "bi-emoji-sunglasses"
    },
    labelOFF:{
        type: String,
        default: "Turn Off"
    },
    colorOFF:{
        type:String,
        default: 'secondary'
    }
})
</script>
<template>
    <label class="container">
  <input type="checkbox" />
  <div class="checkmark">
    <i v-bind:class="['bi', iconLinkON, 'icon', 'No']" fill-rule="evenodd"></i>
    <p class="No name">{{ labelON }}</p>
    
    <i v-bind:class="['bi', iconLinkOFF, 'icon' ,'Yes']" ></i>
    <p class="Yes name">{{labelOFF}}</p>
  </div>
</label>
</template>


<style scoped>
.container {
  --UnChacked-color: var(--bs-secondary);
  --chacked-color: var(--bs-primary);
  --font-color: var(--bs-white);
  --chacked-font-color: var(--font-color);
  --icon-size: 1.5em;
  --anim-time: 0.2s;
  --anim-scale: 0.1;
  --base-radius: 0.8em;
}

/* --- Core Setup & Variables --- */
.container {
  --anim-time: 0.2s; /* Animation speed */
  --anim-scale: 0.1; /* How much it grows on hover */
  position: relative;
  cursor: pointer;
  user-select: none;
}

/* Hide the default checkbox */
.container input {
  display: none;
}

.checkmark {
  background: var(--bs-secondary);
  border-radius: 0.8em;
  padding: 0.5em;
  display: flex;
  align-items: center;
  position: relative;
  width: 120px;
  height: 50px;
  transition: background-color var(--anim-time) ease;
}

/* --- Icons and Text --- */
.checkmark .icon, .checkmark .name {
  position: absolute;
  color: white;
  font-size: 1.5em;
  transition: opacity var(--anim-time) ease, transform var(--anim-time) ease;
}

.checkmark .icon { left: 0.5em; }
.checkmark .name { right: 0.5em; }

/* --- Hiding and Showing Logic --- */
.checkmark .No { opacity: 1; }
.checkmark .Yes { opacity: 0; }

.container input:checked ~ .checkmark {
  background: var(--bs-primary);
}

.container input:checked ~ .checkmark .No { opacity: 0; }
.container input:checked ~ .checkmark .Yes { opacity: 1; }

/* --- ✨ HOVER & ACTIVE ANIMATIONS ✨ --- */
/* Add a subtle grow effect on hover */
.container:hover .checkmark {
  transform: scale(calc(1 + var(--anim-scale)));
}

/* Add a shrink effect when clicking */
.container:active .checkmark {
  transform: scale(calc(1 - var(--anim-scale) / 2));
}
</style>
