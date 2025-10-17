<script setup>
import Button from "./button.vue"
const props = defineProps({
  label: {
    type: String,
    default: 'Label',
  },
  type: {
    type: String,
    default: 'button',
  },
});
</script>
<template>
    <div class="wave-group w-100 p-3">
  <input required="" type="text" class="input">
  <span class="bar"></span>
  <label class="label">
    <span class="label-char" style="--index: 0">C</span>
    <span class="label-char" style="--index: 1">o</span>
    <span class="label-char" style="--index: 2">m</span>
    <span class="label-char" style="--index: 3">m</span>
        <span class="label-char" style="--index: 4">e</span>
    <span class="label-char" style="--index: 5">n</span>
    <span class="label-char" style="--index: 6">t</span>
  </label>
  <Button label="comment"></Button>
</div>
</template>



<style scoped>
.wave-group {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

/* make input fill available space instead of fixed width */
.wave-group .input {
  font-size: 16px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;            /* <-- responsive */
  box-sizing: border-box; /* ensures padding is included in width */
  border: none;
  border-bottom: 1px solid #515151;
  background: transparent;
}

.wave-group .input:focus {
  outline: none;
}

/* floating label */
.wave-group .label {
  color: #999;
  font-size: 18px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 8px;   /* small padding so label sits nicely with responsive input */
  top: 10px;
  display: flex;
}

.wave-group .label-char {
  transition: 0.2s ease all;
  transition-delay: calc(var(--index) * .05s);
}

.wave-group .input:focus ~ label .label-char,
.wave-group .input:valid ~ label .label-char {
  transform: translateY(-20px);
  font-size: 14px;
  color: #5264AE;
}

/* make the underline/bar span the full width of the control */
.wave-group .bar {
  position: relative;
  display: block;
  width: 100%;            /* <-- changed from fixed 200px */
  box-sizing: border-box;
}

.wave-group .bar:before,.wave-group .bar:after {
  content: '';
  height: 2px;
  width: 0;
  bottom: 1px;
  position: absolute;
  background: #5264AE;
  transition: 0.2s ease all;
  -moz-transition: 0.2s ease all;
  -webkit-transition: 0.2s ease all;
}

/* centered draw animation still works when bar is full width */
.wave-group .bar:before {
  left: 50%;
}

.wave-group .bar:after {
  right: 50%;
}

.wave-group .input:focus ~ .bar:before,
.wave-group .input:focus ~ .bar:after {
  width: 50%;
}
</style>