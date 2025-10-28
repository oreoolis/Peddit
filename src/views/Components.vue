<script setup>
import Button from "../components/atoms/button.vue"
import searchBar from "@/components/atoms/searchBar.vue";
import animatedImage from "@/components/atoms/animated/animatedImage.vue";
import PetCard from "@/components/molecules/create-edit-pet/PetCard.vue";
import buttonTogglable from "@/components/atoms/buttonTogglable.vue";
import SelectAndOption from "@/components/atoms/SelectAndOption.vue";
import TextInput from "@/components/atoms/TextInput.vue";
import NutritionalOutputCard from "@/components/molecules/NutritionalOutputCard.vue";
import IngredientCard from "@/components/PetViewComponents/IngredientCard.vue";
import ItemsChecklist from "@/components/PetViewComponents/ItemsChecklist.vue";
import MealPlanCard from "@/components/PetViewComponents/MealPlanCard.vue";
import comment from "@/components/atoms/social/Comment.vue";
import PostSearch from "@/components/molecules/social/PostSearch.vue";
import ProfileSearch from "@/components/molecules/social/ProfileSearch.vue";
import RecipeSearch from "@/components/social/RecipeSearch.vue";
import RecipePost from "@/components/social/RecipePost.vue";
import ShareButton from "@/components/Organisms/social/ShareButton.vue";
import AtomicDemo from "@/views/AtomicDemo.vue";
</script>

<template>
    <div class="container-fluid p-4">
        <h1 class="display-4 headingFont mb-4">Component Gallery</h1>

        <!-- Tab Navigation -->
        <ul class="nav nav-tabs" id="componentTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="atoms-tab" data-bs-toggle="tab" data-bs-target="#atoms-tab-pane" type="button" role="tab">Atoms</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="molecules-tab" data-bs-toggle="tab" data-bs-target="#molecules-tab-pane" type="button" role="tab">Molecules</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="social-tab" data-bs-toggle="tab" data-bs-target="#social-tab-pane" type="button" role="tab">Social Components</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="atomic-demo-tab" data-bs-toggle="tab" data-bs-target="#atomic-demo-pane" type="button" role="tab">Atomic Demo</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="style-guide-tab" data-bs-toggle="tab" data-bs-target="#style-guide-tab-pane" type="button" role="tab">Style Guide</button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content border border-top-0 p-4" id="componentTabContent">
            <!-- Atoms Pane -->
            <div class="tab-pane fade show active" id="atoms-tab-pane" role="tabpanel">
                <h3 class="mb-3">Buttons</h3>
                <div class="row row-cols-3 mb-4">
                    <div class="col"><Button class="m-2" label="Primary" /><Button class="m-2" label="With Icon"><i class="bi bi-heart-fill mx-1" ></i></Button></div>
                    <div class="col"><Button class="m-2" label="Secondary" color="secondary" /><Button class="m-2" label="Danger" color="danger" /></div>
                    <div class="col"><Button class="m-2" label="Outline" outline /><Button class="m-2" label="Secondary Outline" color="secondary" outline /></div>
                </div>
                <hr class="my-4">
                <h3 class="mb-3">Form Elements</h3>
                <div class="row">
                    <div class="col-md-4"><searchBar type="text" placeholder="Search Bar..." /></div>
                    <div class="col-md-4"><searchBar type="textarea" placeholder="Text Area..." /></div>
                    <div class="col-md-4"><SelectAndOption defaultLabel="Select Field..." :options="[{ value: '1', label: 'Option 1' }]" /></div>
                    <div class="col-md-4 mt-3"><TextInput label="Text Input Field" /></div>
                    <div class="col-md-4 mt-3 d-flex align-items-center"><buttonTogglable /></div>
                    <div class="col-md-4 mt-3"><ShareButton initial-text="Edit initial-text to edit share message!" title="Custom Title here" button-label="Share Button(adjustable text)"/></div>
                    <animatedImage src="/src/assets/Sprite/Cat/Walk.png" :frameWidth="48" :frameHeight="48" :frames="6" :fps="8" />
                    <animatedImage src="/src/assets/Sprite/Cat/Hurt.png" :frameWidth="48" :frameHeight="48" :frames="2" :fps="2" />
                    <animatedImage src="/src/assets/Sprite/Cat/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />
                    <animatedImage src="/src/assets/Sprite/Cat/Death.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />
                    <animatedImage src="/src/assets/Sprite/Cat/Attack.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />

                    <animatedImage src="/src/assets/Sprite/Dog/Walk.png" :frameWidth="48" :frameHeight="48" :frames="6" :fps="8" />
                    <animatedImage src="/src/assets/Sprite/Dog/Hurt.png" :frameWidth="48" :frameHeight="48" :frames="2" :fps="2" />
                    <animatedImage src="/src/assets/Sprite/Dog/Idle.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />
                    <animatedImage src="/src/assets/Sprite/Dog/Death.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />
                    <animatedImage src="/src/assets/Sprite/Dog/Attack.png" :frameWidth="48" :frameHeight="48" :frames="4" :fps="4" />                    
                </div>
            </div>

            <!-- Molecules Pane -->
            <div class="tab-pane fade" id="molecules-tab-pane" role="tabpanel">
                <div class="row">
                    <div class="col-md-4"><h4 class="text-center">PetCard</h4><PetCard /></div>
                    <div class="col-md-4"><h4 class="text-center">IngredientCard</h4><IngredientCard name="Food Name" amount="300KG" /></div>
                    <div class="col-md-4"><h4 class="text-center">MealPlanCard</h4><MealPlanCard /></div>
                    <div class="col-md-6 mt-4"><h4 class="text-center">NutritionalOutputCard</h4><NutritionalOutputCard /></div>
                    <div class="col-md-6 mt-4"><h4 class="text-center">ItemsChecklist</h4><ItemsChecklist label="Checklist Item" /></div>
                </div>
            </div>

            <!-- Social Components Pane -->
            <div class="tab-pane fade" id="social-tab-pane" role="tabpanel">
                <div class="row">
                    <div class="col-12 mb-3"><h4 class="text-center">Comment</h4><comment /></div>
                    <div class="col-md-6 mb-3"><h4 class="text-center">PostSearch</h4><PostSearch /></div>
                    <div class="col-md-6 mb-3"><h4 class="text-center">ProfileSearch</h4><ProfileSearch /></div>
                    <div class="col-md-6 mb-3"><h4 class="text-center">RecipeSearch</h4><RecipeSearch/></div>
                    <div class="col-md-6 mb-3"><h4 class="text-center">RecipePost</h4><RecipePost /></div>
                </div>
            </div>

            <!-- Atomic Demo Pane (imports content from AtomicDemo.vue) -->
            <div class="tab-pane fade" id="atomic-demo-pane" role="tabpanel">
              <AtomicDemo />
            </div>

            <!-- Style Guide Pane -->
            <div class="tab-pane fade" id="style-guide-tab-pane" role="tabpanel">
                <h3 class="mb-3">Fonts</h3>
                <h1 class="brandFont">.brandFont</h1><h1 class="headingFont">.headingFont</h1><h1 class="bodyFont">.bodyFont</h1>
                <hr class="my-4">
                <h3 class="mb-3">Colors</h3>
                <div class="row">
                    <div class="col-md-6"><h1 class="primary">.primary</h1><h1 class="bg-primary text-white">.bg-primary</h1></div>
                    <div class="col-md-6"><h1 class="primary-light">.primary-light</h1><h1 class="bg-primary-light">.bg-primary-light</h1></div>
                    <div class="col-md-6"><h1 class="warning">.warning</h1><h1 class="bg-warning">.bg-warning</h1></div>
                    <div class="col-md-6"><h1 class="success">.success</h1><h1 class="bg-success text-white">.bg-success</h1></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>