<script setup>
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import Button from '@/components/atoms/button.vue';
import ShareButton from '@/components/Organisms/social/ShareButton.vue';
import { ref } from 'vue';

const props = defineProps({
  RecipeId: { type: String, default: '123e' },
  Username: { type: String, default: 'JohnDoe' },
  User_Image: { type: String, default: '/src/assets/person.jpg' },
  Recipe_Name: { type: String, default: 'Beef Boost' },
  Recipe_Desc: { type: String, default: 'A Yummy Treat for golden Retrievers' },
  Vote_score: { type: Number, default: 99 },
  Comment_count: { type: Number, default: 12 },
  Animal_Type: { type: String, default: 'dog' }, // 'dog' or 'cat', if its unknown there will be a shrug
  Animal_Breed: { type: String, default: 'Golden Retriever' },
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
</script>

<template>
<div class="card shadow-md">
    <!-- HEADER -->
    <div class="card-header bg-primary text-white d-flex align-items-center justify-content-between">
        <!-- Left: avatar + user info (flex-shrink so it won't grow) -->
        <div class="d-flex align-items-center flex-shrink-0">
        <base-avatar src="https://picsum.photos/seed/defaultpet/200/200.jpg" size="xs" class="me-2" />
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
            <div class="h5 mb-0">{{props.Animal_Breed}}</div>       
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
    <div class="card-footer bg-primary d-flex justify-content-between">
        <Button label="View Recipe" color="white"></Button>
        <ShareButton ></ShareButton>
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
</style>