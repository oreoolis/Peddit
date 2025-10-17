<script>
export default {
    name: 'AppButton',
    props: {
        label: {
        type: String,
        default: 'Click Me'
        },
        type: {
        type: String,
        default: 'button'
        }
    },
    emits: ['click'],
    methods: {
        handleClick(event) {
        this.$emit('click', event);
        }
    }
}
</script>

<template>
<button :type="type" class="app-button" @click="handleClick" aria-label="button">
  <span class="button-content">
    {{ label }}
  </span>
</button>
</template>

<style scoped>

button.app-button {
    border: none;
    background: linear-gradient(180deg, #2b9bb3 0%, #1f7286 100%);
    border-radius: 0.9em;
    cursor: pointer;
    padding: 0.8em 1.2em;
    transition: transform 160ms ease, box-shadow 180ms ease, background 120ms ease;
    font-size: 16px;
    box-shadow:
      0 10px 30px rgba(10,20,40,0.12),    /* large soft shadow */
      0 4px 10px rgba(10,20,40,0.08),     /* mid shadow */
      inset 0 1px 0 rgba(255,255,255,0.12);/* subtle inner sheen */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
}

button.app-button .button-content {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 0.2px;
}

/* Hover / focus */
button.app-button:hover {
    transform: translateY(-3px);
    box-shadow:
      0 18px 44px rgba(10,20,40,0.14),
      0 6px 16px rgba(10,20,40,0.10),
      inset 0 1px 0 rgba(255,255,255,0.14);
}
button.app-button:focus {
    outline: none;
    box-shadow:
      0 18px 44px rgba(10,20,40,0.18),
      0 6px 16px rgba(10,20,40,0.12),
      0 0 0 4px rgba(34,150,200,0.12);
}

/* Active (pressed) */
button.app-button:active {
    transform: translateY(0);
    box-shadow:
      0 6px 18px rgba(10,20,40,0.10),
      inset 0 2px 6px rgba(0,0,0,0.08);
    background: linear-gradient(180deg, #1f7286 0%, #196173 100%);
}

/* Disabled */
button.app-button:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

</style>