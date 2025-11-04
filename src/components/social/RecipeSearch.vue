<script setup>
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import Button from '@/components/atoms/button.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  RecipeId: { type: String, default: '123e' },
  Username: { type: String, default: 'JohnDoe' },
  User_Image: { type: String, default: '/src/assets/person.jpg' },
  Recipe_Name: { type: String, default: 'Beef Boost' },
  Recipe_Desc: { type: String, default: 'A Yummy Treat for golden Retrievers' },
  Vote_score: { type: Number, default: 99 },
  Comment_count: { type: Number, default: 12 },
  Animal_Type: { type: String, default: 'dog' }, // 'dog' or 'cat', if its unknown there will be a shrug
  Cost_Per_Week: { type: Number, default: 25.5 },
  Recipe_Nutrition_Stats: {
    type: Array,
    default: () => ([
      { LabelName: 'Iron', value: '69', unit: 'mg' },
      { LabelName: 'Calcium', value: '120', unit: 'mg' },
      { LabelName: 'Vitamin A', value: '69', unit: 'mg' },
      { LabelName: 'Fibre', value: '4', unit: 'g' }
    ])
  }
});

const expanded = ref(false);
const router = useRouter();

function onCardClick(e) {
  // ignore clicks on explicit controls (buttons, links, inputs) OR elements marked .no-nav
  const bad = e.target.closest('button, a, input, select, .no-nav');
  if (bad) return;
  //router.push({ path: '/view-recipe-post', query: { q: props.RecipeId } });
  router.push({ path: '/view-recipe-post/' + props.RecipeId });
}
</script>

<template>
<div class="card shadow-md" >
    <!-- HEADER -->
    <div class="card-header bg-primary text-white d-flex align-items-center justify-content-between">
        <!-- Left: avatar + user info (flex-shrink so it won't grow) -->
        <div class="d-flex align-items-center flex-shrink-0">
        <base-avatar :src="User_Image" size="xs" class="me-2" />
        <div class="header-user">
            <div class="fw-bold">@{{props.Username}}</div>
        </div>
        </div>

        <!-- Center: flexible title / description (grows to fill available space) -->
        <div class="header-center text-center px-3 flex-grow-1">
        <div class="h5 mb-0">{{ props.Recipe_Name }}</div>
        <small class="d-block text-white-50">{{props.Recipe_Desc}}</small>
        </div>

        <!-- Right: compact stats (flex-shrink so it stays sized to content) -->
        <div class="header-right d-flex align-items-center gap-3 flex-shrink-0">
            <i class="bi bi-arrow-up"></i>
            <div class="fw-bold">{{ props.Vote_score }}</div>
            <i class="bi bi-chat-left-text"></i>
            <div class="fw-bold">{{ props.Comment_count }}</div>
        </div>
    </div>
    <!-- Recipe Header -->
    <div class="card-header d-flex align-items-center justify-content-between">
        <!-- Left: avatar + user info (flex-shrink so it won't grow) -->
        <div class="d-flex align-items-center flex-shrink-0">
        <div class="header-user">
            <h2 v-if="props.Animal_Type == 'dog'" class="headingFont fw-bolder">Type: 🐶</h2>
            <h2 v-else-if="props.Animal_Type == 'cat'" class="headingFont fw-bolder">Type: 🐱</h2>
            <h2 v-else class="headingFont fw-bolder">Type: 🤷 </h2>           
        </div>
        </div>

        <!-- Right: compact stats (flex-shrink so it stays sized to content) -->
        <div class="header-right d-flex align-items-center gap-3 flex-shrink-0 headingFont">
            <h4 class="fw-bold">Cost:</h4>
            <h4 class="fw-bold">$ <span class="text-success ">{{ props.Cost_Per_Week }}</span> / Week</h4>
        </div>
    </div>
    <!-- nutritonal Data here -->
    <div class="card-body">
      <button class="nutr-toggle" @click="expanded = !expanded" aria-expanded="false">
        <span>{{ expanded ? 'Hide nutrition' : 'Show nutrition' }}</span>
        <span class="caret" :class="{ open: expanded }">▾</span>
      </button>
      <div class="nutr-collapse" :class="{ open: expanded }">
       <div class="nutr-grid">
         <div class="nutr-item" v-for="(data, idx) in props.Recipe_Nutrition_Stats" :key="data.LabelName + '-' + idx">
           <BaseLabel size="lg" variant="dark" weight="bold">{{ data.LabelName }}</BaseLabel>
           <BaseStatNumber :value="data.value" :unit="data.unit" />
         </div>
       </div>
      </div>
     </div>
    <div @click="onCardClick" class="card-footer bg-primary text-white d-flex justify-content-center">
        <h3 >View Post</h3>
    </div>

</div>
</template>

<style scoped>
/* nutritional grid: two columns, collapses to one on small screens */
.nutr-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 18px;
  align-items: center;
}

/* each item keeps label and stat aligned horizontally */
.nutr-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 8px;
  border-radius: 8px;
opacity: 0;
  animation: slideFade .42s cubic-bezier(.2,.85,.32,1) forwards;
  animation-delay: calc(var(--idx, 0) * 70ms);
  will-change: transform, opacity;
}

/* small screens: single column */
@media (max-width: 576px) {
  .nutr-grid { grid-template-columns: 1fr; }
}

@keyframes slideFade {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* collapsible container using max-height for smooth animation */
.nutr-collapse {
  max-height: 0;
  overflow: hidden;
  transition: max-height .36s cubic-bezier(.2,.9,.3,1), padding .28s ease;
  padding-top: 0;
}
.nutr-collapse.open {
  max-height: 420px; /* large enough for full list; adjust as needed */
  padding-top: 10px;
}

/* toggle button + rotating caret */
.nutr-toggle {
  background: transparent;
  border: none;
  color: var(--bs-body-color, #222);
  display:flex;
  gap:8px;
  align-items:center;
  cursor:pointer;
  padding:6px 0;
  font-weight:600;
}
.caret { display:inline-block; transition: transform .28s ease; }
.caret.open { transform: rotate(180deg); }

.card {
  position: relative;
  transition: transform .28s cubic-bezier(.22,.9,.3,1), box-shadow .28s ease;
  will-change: transform, box-shadow;
  transform-origin: center;
  z-index: 0;
}
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(255,255,255,0.025), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity .28s ease, transform .28s ease;
  transform: translateY(6px);
  z-index: -1;
}
.card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 15px 50px rgba(32, 122, 185, 0.26);
}
.card:hover::before { opacity: 1; transform: translateY(0); }

.card-footer {
  position: relative;
  cursor: pointer;
  transition: transform .24s ease, box-shadow .24s ease;
  z-index: 1;
  display: flex;
}

/* subtle background pulse on hover (like PetCard summary) */
.card-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: rgba(61, 172, 216, 0.31); /* #3dacd84f */
  opacity: 0;
  transform: scale(0.96);
  transition: opacity .28s ease, transform .28s ease;
  z-index: -1;
}
.card-footer:hover::before {
  opacity: 1;
  transform: scale(1);
}

/* elevate the label text for a nice micro-lift */
.card-footer h3,
.card-footer .btn-label {
  margin: 0;
  transition: transform .22s cubic-bezier(.2,.9,.3,1), color .18s ease;
  will-change: transform, color;
}
.card-footer:hover h3,
.card-footer:hover .btn-label {
  transform: translateY(-4px);
  color: #fff;
}

/* click ripple for tactile feedback */
.card-footer::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 12px;
  background: rgba(255,255,255,0.14);
  border-radius: 50%;
  transform: translate(-50%,-50%) scale(0);
  opacity: 0;
  pointer-events: none;
}
.card-footer:active::after {
  animation: footerRipple .6s ease-out;
}
@keyframes footerRipple {
  0% { transform: translate(-50%,-50%) scale(0.4); opacity: .6; }
  100% { transform: translate(-50%,-50%) scale(6); opacity: 0; }
}

/* focus style for keyboard users */
.card-footer:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(61,172,216,0.12);
}

/* responsive tweak */
@media (max-width: 576px) {
  .card-footer { padding: .6rem; }
  .card-footer h3, .card-footer .btn-label { font-size: 1rem; }
}
</style>