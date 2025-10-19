<script setup>
import BaseAvatar from '@/components/atomic/BaseAvatar.vue';
import BaseIcon from '@/components/atomic/BaseIcon.vue';
import BaseStatNumber from '@/components/atomic/BaseStatNumber.vue';
import BaseLabel from '@/components/atomic/BaseLabel.vue';
import BaseProgressRing from '@/components/atomic/BaseProgressRing.vue';
import BaseButton from '@/components/atomic/BaseButton.vue';
import BaseBadge from '@/components/atomic/BaseBadge.vue';
import HealthAvatar from '@/components/atomic/HealthAvatar.vue';
import StatCard from '@/components/atomic/StatCard.vue';
import PetInfoChip from '@/components/atomic/PetInfoChip.vue';
import HealthProgressBar from '@/components/atomic/HealthProgressBar.vue';
import InfoDetail from '@/components/atomic/InfoDetail.vue';
import PetHealthHeader from '@/components/atomic/PetHealthHeader.vue';
import PetHealthDetails from '@/components/atomic/PetHealthDetails.vue';
import PetHealthAccordionItem from '@/components/atomic/PetHealthAccordionItem.vue';

const dummyPet = {
  id: '1',
  name: 'Buddy',
  kind: 'dog',
  gender: 'male',
  breed: 'Golden Retriever',
  birthdate: '2019-05-15',
  weight_kg: 30,
  body_condition_scale: 5,
  neutered: true,
  allergies: 'Pollen, Dust',
  photo_url: 'https://picsum.photos/seed/buddy/200/200.jpg',
  updated_at: '2024-01-15'
};

const dummyPet2 = {
  id: '2',
  name: 'Whiskers',
  kind: 'cat',
  gender: 'female',
  breed: 'Persian',
  birthdate: '2021-03-20',
  weight_kg: 4.5,
  body_condition_scale: 3,
  neutered: false,
  allergies: null,
  photo_url: 'https://picsum.photos/seed/whiskers/200/200.jpg',
  updated_at: '2024-01-10'
};
</script>

<template>
  <div class="atomic-demo">
    <div class="container py-5">
      <h1 class="text-center mb-5">Atomic Design Components Demo</h1>

      <!-- ATOMS Section -->
      <section class="mb-5">
        <h2 class="section-title">⚛️ Atoms</h2>
        
        <div class="component-showcase mb-4">
          <h4>BaseAvatar</h4>
          <div class="d-flex gap-3 align-items-center flex-wrap">
            <BaseAvatar src="https://picsum.photos/seed/pet1/200" size="xs" />
            <BaseAvatar src="https://picsum.photos/seed/pet2/200" size="sm" />
            <BaseAvatar src="https://picsum.photos/seed/pet3/200" size="md" />
            <BaseAvatar src="https://picsum.photos/seed/pet4/200" size="lg" />
            <BaseAvatar src="https://picsum.photos/seed/pet5/200" size="xl" />
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseIcon</h4>
          <div class="d-flex gap-3 align-items-center flex-wrap">
            <BaseIcon name="heart-fill" variant="danger" size="sm" />
            <BaseIcon name="star-fill" variant="warning" size="md" />
            <BaseIcon name="shield-fill-check" variant="success" size="lg" />
            <BaseIcon name="gender-male" variant="primary" size="xl" />
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseStatNumber</h4>
          <div class="d-flex gap-4 align-items-center flex-wrap">
            <BaseStatNumber value="30" unit="kg" size="sm" variant="primary" />
            <BaseStatNumber value="5" unit="/9" size="md" variant="success" />
            <BaseStatNumber value="85" unit="%" size="lg" variant="warning" />
            <BaseStatNumber value="120" size="xl" variant="danger" />
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseLabel</h4>
          <div class="d-flex flex-column gap-2">
            <BaseLabel size="xs" variant="muted" weight="light">Extra Small Label</BaseLabel>
            <BaseLabel size="sm" variant="secondary" weight="normal">Small Label</BaseLabel>
            <BaseLabel size="md" variant="dark" weight="semibold">Medium Label</BaseLabel>
            <BaseLabel size="lg" variant="primary" weight="bold">Large Label</BaseLabel>
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseProgressRing</h4>
          <div class="d-flex gap-4 align-items-center flex-wrap">
            <BaseProgressRing :value="85" :size="80">
              <div style="font-weight: 700; font-size: 1.2rem;">85%</div>
            </BaseProgressRing>
            <BaseProgressRing :value="60" :size="100" color="#ffc107">
              <div style="font-weight: 700; font-size: 1.5rem;">60%</div>
            </BaseProgressRing>
            <BaseProgressRing :value="30" :size="120">
              <div style="font-weight: 700; font-size: 1.8rem;">30%</div>
            </BaseProgressRing>
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseButton</h4>
          <div class="d-flex gap-2 flex-wrap">
            <BaseButton variant="primary" size="sm">Small Button</BaseButton>
            <BaseButton variant="success" icon="check-circle">With Icon</BaseButton>
            <BaseButton variant="danger" :loading="true">Loading</BaseButton>
            <BaseButton variant="outline-primary" icon="heart" size="lg">Large Button</BaseButton>
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>BaseBadge</h4>
          <div class="d-flex gap-2 flex-wrap">
            <BaseBadge variant="primary">Primary</BaseBadge>
            <BaseBadge variant="success" icon="check-circle-fill" pill>Success</BaseBadge>
            <BaseBadge variant="warning" pill>Warning</BaseBadge>
            <BaseBadge variant="danger" icon="exclamation-triangle-fill">Danger</BaseBadge>
          </div>
        </div>
      </section>

      <!-- MOLECULES Section -->
      <section class="mb-5">
        <h2 class="section-title">🧬 Molecules</h2>

        <div class="component-showcase mb-4">
          <h4>HealthAvatar</h4>
          <div class="d-flex gap-4 align-items-center flex-wrap">
            <HealthAvatar 
              src="https://picsum.photos/seed/buddy/200"
              alt="Buddy"
              :health-percentage="85"
              size="sm"
            />
            <HealthAvatar 
              src="https://picsum.photos/seed/whiskers/200"
              alt="Whiskers"
              :health-percentage="60"
              size="md"
            />
            <HealthAvatar 
              src="https://picsum.photos/seed/max/200"
              alt="Max"
              :health-percentage="30"
              size="lg"
            />
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>StatCard</h4>
          <div class="row g-3">
            <div class="col-6 col-md-3">
              <StatCard label="Weight" value="30" unit="kg" variant="primary" />
            </div>
            <div class="col-6 col-md-3">
              <StatCard label="Age" value="5" unit="years" variant="success" />
            </div>
            <div class="col-6 col-md-3">
              <StatCard label="Health" value="85" unit="%" variant="warning" />
            </div>
            <div class="col-6 col-md-3">
              <StatCard label="Score" value="5" unit="/9" variant="danger" :highlight="true" />
            </div>
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>PetInfoChip</h4>
          <div class="bg-light p-3 rounded">
            <PetInfoChip
              name="Buddy"
              :age="5"
              breed="Golden Retriever"
              gender="male"
              kind="dog"
              :neutered="true"
            />
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>HealthProgressBar</h4>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <HealthProgressBar
                label="Excellent Health"
                :percentage="85"
                description="Your pet is in great condition!"
              />
            </div>
            <div class="col-12 col-md-6">
              <HealthProgressBar
                label="Needs Attention"
                :percentage="45"
                description="Consider consulting your vet."
                size="lg"
              />
            </div>
          </div>
        </div>

        <div class="component-showcase mb-4">
          <h4>InfoDetail</h4>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <InfoDetail label="Allergies" value="Pollen, Dust mites" />
            </div>
            <div class="col-12 col-md-6">
              <InfoDetail label="Last Updated" value="January 15, 2024" />
            </div>
          </div>
        </div>
      </section>

      <!-- ORGANISMS Section -->
      <section class="mb-5">
        <h2 class="section-title">🦠 Organisms</h2>

        <div class="component-showcase mb-4">
          <h4>PetHealthAccordionItem (Complete)</h4>
          <PetHealthAccordionItem :pet="dummyPet" />
        </div>

        <div class="component-showcase mb-4">
          <h4>Another Pet Example</h4>
          <PetHealthAccordionItem :pet="dummyPet2" />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.atomic-demo {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #667eea;
}

.component-showcase {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.component-showcase h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-family: 'Courier New', monospace;
  background: #f7fafc;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  display: inline-block;
}
</style>
