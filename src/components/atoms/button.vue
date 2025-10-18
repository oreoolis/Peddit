<script>
export default {
    name: 'AppButton',
    props: {
        label: {
        type: String,
        default: 'Click Me'
        },
        outline: {
        type: Boolean,
        default: false,
        },
        color:{
          type: String,
          default: 'primary', // this can be primary, secondary, success, danger, warning, info, light, dark
        },
    },
    emits: ['click'],
    methods: {
        handleClick(event) {
        this.$emit('click', event);
        }
    },
    computed:{
      buttonClasses(){
        const classes = ['app-button'];
        if(this.outline) {
          classes.push(`btn-outline-${this.color}`);
          classes.push('btn');
          return classes.join(' ');
        } else {
          classes.push(`btn-${this.color}`);
          classes.push('btn');
          return classes.join(' ');
        }
      }
    }
}
</script>

<template>
<button :type="type" :class="buttonClasses" @click="handleClick" aria-label="button">
  <slot width="16px" height="16px"></slot>
  <span class="button-content">
    {{ label }}
  </span>
</button>
</template>

<style scoped>

button.app-button {
    font-size: 16px;
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.12);/* subtle inner sheen */
}

button.app-button .button-content {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  letter-spacing: 0.2px;
}

/* Hover / focus */
button.app-button:hover {
    box-shadow:
      0 18px 44px rgba(10,20,40,0.14),
      0 6px 16px rgba(10,20,40,0.10),
      inset 0 1px 0 rgba(255,255,255,0.14);
}
button.app-button:focus {
    box-shadow:
      0 18px 44px rgba(10,20,40,0.18),
      0 6px 16px rgba(10,20,40,0.12),
      0 0 0 4px rgba(34,150,200,0.12);
}

/* Active (pressed) */
button.app-button:active {
    transform: translateY(0);
    box-shadow:
      0px 4px 4px rgba(0, 0, 0, 0.25) inset;
    background-color:  #196173;
    color: #EBEBEB
}

/* Disabled */
button.app-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}


</style>