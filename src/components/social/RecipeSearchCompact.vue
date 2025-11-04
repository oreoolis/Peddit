<script setup>
import { useRouter } from 'vue-router';
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import animatedImage from '../atoms/animated/animatedImage.vue';
const props = defineProps({
  RecipeId: { type: [String, Number], required: true },
  Username: { type: String, default: 'Unknown' },
  User_Image: { type: String, default: '/src/assets/person.jpg' },
  Recipe_Name: { type: String, default: 'Untitled' },
  Recipe_Desc: { type: String, default: '' },
  Vote_score: { type: Number, default: 0 },
  Comment_count: { type: Number, default: 0 },
  Animal_Type: { type: String, default: '' }
});

const router = useRouter();
function goToRecipe() {
  router.push({ path: '/view-recipe-post/' + props.RecipeId });
}

</script>

<template>
  <article class="compact-card" @click="goToRecipe" role="button" tabindex="0">
    <div class="left">
      <animatedImage v-if="Animal_Type=='cat'" src="/src/assets/Sprite/Dog/Walk.png" :width="46" :height="46" :frameWidth="48" :frameHeight="48" :frames="6" :fps="8" />
      <animatedImage v-else src="/src/assets/Sprite/Cat/Walk.png" :width="46" :height="46" :frameWidth="48" :frameHeight="48" :frames="6" :fps="8" />
    </div>
    <div class="body">
      <div class="title">{{ Recipe_Name }}</div>
      <div class="desc">{{ Recipe_Desc }}</div>
      <div class="meta">
        <span class="meta-item"><i class="bi bi-arrow-up"></i> {{ Vote_score }}</span>
        <span class="meta-item"><i class="bi bi-chat-left-text"></i> {{ Comment_count }}</span>

      </div>
    </div>
  </article>
</template>

<style scoped>
.compact-card {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--bs-primary);
  background: #fff;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease;
}
.compact-card:focus,
.compact-card:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 8px 20px rgba(18,38,63,0.06); }
.left { flex: 0 0 auto; }
.body { flex: 1 1 auto; min-width: 0; }
.title { 
    font-weight: 600; 
    color: #0b2540; 
    white-space: 
    nowrap; overflow: 
    hidden; text-overflow: 
    ellipsis; }
.desc { 
    font-size: 0.9rem; 
    color: #6b7280; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; }
.meta { 
    margin-top: 6px; 
    display: flex; 
    gap: 10px; 
    color: #9ca3af; 
    font-size: 0.85rem; }
.meta-item { 
    display: inline-flex; 
    align-items: center; 
    gap: 6px; }

/* neon glow + ensure content sits above glow layer */
.compact-card > * { position: relative; z-index: 1; }
.compact-card {
  position: relative;
  overflow: hidden; /* clip shine and glow */
}

/* diagonal sheen (already present in some builds) kept for compatibility */
.compact-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -150%;
  width: 40%;
  height: 220%;
  transform: rotate(18deg) translateX(-150%);
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0;
}
.compact-card:hover::before {
  animation: shine 700ms ease-in-out forwards;
}

@keyframes shine {
  0% { transform: rotate(18deg) translateX(-150%); opacity: 0; }
  10% { opacity: 0.6; }
  100% { transform: rotate(18deg) translateX(220%); opacity: 0; }
}

/* neon glow layer */
.compact-card::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  filter: blur(10px);
  opacity: 0;
  transform: scale(0.96);
  transition: opacity .28s ease, transform .28s ease;
  pointer-events: none;
  z-index: 0;
}
.compact-card:hover::after,
.compact-card:focus::after {
  opacity: 1;
  transform: scale(1);
}

/* stronger neon border on hover (for contrast with glow) */
.compact-card:hover {
  border-color: rgba(61,172,216,0.9);
}

@media (prefers-reduced-motion: reduce) {
  .compact-card::before,
  .compact-card::after {
    transition: none !important;
    animation: none !important;
    opacity: 0.6;
  }
}
</style>
