<script>
</script>
<template>
    <div class="custom-checkbox-container">
        <input class="custom-checkbox-input" id="modernCheckbox1" type="checkbox" />
        <label class="custom-checkbox-label" for="modernCheckbox1">
            <span class="custom-checkbox-text bodyFont">Rectange</span>
        </label>
    </div>
</template>

<style>
/* CSS (updated with faster focus ring transition) */
.custom-checkbox-container {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    padding: 10px;
}

.custom-checkbox-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.custom-checkbox-label {
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 32px;
    transition: all 0.2s ease;
}

/* Checkbox box */
.custom-checkbox-label:before {
    content: "";
    position: absolute;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    border: 2px solid #ccc;
    transition: all 0.3s ease;
    z-index: 1;
}

/* Checkmark */
.custom-checkbox-label:after {
    content: "";
    position: absolute;
    left: 6px;
    top: 3px;
    width: 8px;
    height: 12px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) scale(0);
    opacity: 0;
    transition: all 0.2s ease;
    z-index: 3;
}

/* Checked state */
.custom-checkbox-input:checked+.custom-checkbox-label:before {
    background: linear-gradient(135deg, #00b7ff 0%, #00b7ff 100%);
    border-color: #00b7ff;
    overflow: hidden;
}

/* Shine effect */
.custom-checkbox-label span.custom-checkbox-shine {
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    z-index: 2;
    pointer-events: none;
}

.custom-checkbox-input:checked+.custom-checkbox-label span.custom-checkbox-shine:after {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 20px;
    height: 100px;
    background: linear-gradient(to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: rotate(45deg);
    animation: shine 0.6s ease-in-out infinite;
}

/* Checkmark animation */
.custom-checkbox-input:checked+.custom-checkbox-label:after {
    transform: rotate(45deg) scale(1);
    opacity: 1;
}

/* Hover effect */
.custom-checkbox-container:hover .custom-checkbox-label:before {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
}

/* Text styling */
.custom-checkbox-text {
    color: #333;
    font-size: 26px;
    transition: color 0.2s ease;
    position: relative;
    z-index: 4;
}

.custom-checkbox-container:hover .custom-checkbox-text {
    color: #00b7ff;
}

/* Focus state with transition */
.custom-checkbox-input:focus+.custom-checkbox-label:before {
    outline: 2px solid #00b7ff;
    outline-offset: 2px;
    transition: outline 0.1s ease-in-out;
    /* Added fast transition for outline */
}

/* Ensure outline is initially off with transition readiness */
.custom-checkbox-label:before {
    outline: 0 solid transparent;
    /* Initial state for smooth transition */
}

/* Shine animation keyframes */
@keyframes shine {
    0% {
        left: -100%;
    }

    40% {
        left: 100%;
    }

    100% {
        left: 100%;
    }
}
</style>