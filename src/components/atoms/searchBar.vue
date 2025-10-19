<template>
    <div class="input-group mx-auto py-1 bodyFont rounded-pill my-3" style="box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <button class="input-group-text bg-transparent border-0 ps-3 pe-0">
       <i class="bi bi-search"></i>
    </button>
    <input 
        type="text" 
        class="form-control bg-transparent border-0" 
        placeholder="Search" 
        aria-label="Search"
    >
</div>

</template>

<style scoped>
.input-group {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), box-shadow .18s ease, background .18s ease;
  will-change: transform, box-shadow;
    background: rgb(255, 255, 255);
}

/* subtle glow when search has focus (keyboard-visible focus kept by :focus-visible) */
.input-group:focus-within {
  transform: translateY(-2px) scale(1.01);

  box-shadow: 0 10px 30px rgba(var(--bs-white), 0.10);
}

/* input placeholder animation */
.input-group .form-control::placeholder {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), opacity .12s ease, color .12s ease;
}
.input-group:focus-within .form-control::placeholder {
  transform: translateY(-4px);
  opacity: 0.6;
  color: rgba(var(--bs-primary-rgb), 0.6);
}

/* search icon micro-interaction */
.input-group .bi {
  transition: transform .18s cubic-bezier(.2,.9,.2,1), color .12s ease;
  color: rgba(0,0,0,0.6);
}
.input-group:focus-within .bi {
  transform: translateX(-4px) scale(1.06);
  color: var(--bs-primary);
}

/* neutralize native focus decorations but keep keyboard-visible focus */
.input-group .form-control:focus,
.input-group .form-control:active {
  outline: none;
  box-shadow: none;
  background: var(--bs-primary-rgb);
}
.input-group .form-control:focus-visible {
  box-shadow: 0 8px 26px rgba(var(--bs-primary-rgb), 0.01);
  border-radius: 999px;
}
</style>