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
<button :class="buttonClasses" @click="handleClick" aria-label="button">
  <slot width="16px" height="16px"></slot>
  <span class="button-content">
    {{ label }}
  </span>
</button>
</template>

<style scoped>

button.app-button {
  overflow: hidden;
  transition: box-shadow .18s ease, transform .12s ease;
  will-change: transform, box-shadow;
}

button.app-button:not(:disabled):hover {
  transform: translateY(-2px);
}
button.app-button .button-content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
}
button.app-button::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -140%;
  width: 40%;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-18deg);
  opacity: 0.2;
}
button.app-button:not(:disabled):hover::before {
  animation: shine 900ms ease-in-out;
}
/* Hover / focus */
button.app-button:hover {
    box-shadow:
      0 18px 44px rgba(10,20,40,0.14),
      0 6px 16px rgba(10,20,40,0.10),
      inset 0 1px 0 rgba(255,255,255,0.14);
}
button.app-button:focus-visible {
  outline: none;
}

/* Active (pressed) */
button.app-button:active {
    box-shadow:
      0px 4px 4px rgba(0, 0, 0, 0.25) inset;
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