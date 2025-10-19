<script setup>
import Button from "../components/atoms/button.vue"
import searchBar from "@/components/atoms/searchBar.vue";
import PetProfileCard from "@/components/molecules/PetProfileCard.vue";
import PetCard from "@/components/molecules/PetCard.vue";

</script>

<template>
  <div class="atomic-demo">
    <div class="container py-5">
      <h1 class="text-center mb-5">🎨 Atomic Design Components Demo</h1>

      <!-- ORGANISMS Section FIRST -->
      <section class="mb-5">
        <h2 class="section-title">🦠 Complete Organisms</h2>

        <div class="component-showcase mb-4">
          <h4>PetHealthAccordionItem - Healthy Pet</h4>
          <PetHealthAccordionItem :pet="dummyPet" />
        </div>

        <div class="component-showcase mb-4">
          <h4>PetHealthAccordionItem - Needs Attention</h4>
          <PetHealthAccordionItem :pet="dummyPet2" />
        </div>
      </section>

      <!-- MOLECULES Section -->
      <section class="mb-5">
        <h2 class="section-title">🧬 Molecules</h2>

        <div class="component-showcase mb-4">
          <h4>HealthAvatar</h4>
          <div class="d-flex gap-4 align-items-center flex-wrap justify-content-center">
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
      </section>

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

     <!-- SEARCH BAR -->
<searchBar></searchBar>

     <!-- PET CARD -->
<PetCard></PetCard>>


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
