<script setup>
import Button from "../components/atoms/button.vue"
import searchBar from "@/components/atoms/searchBar.vue";
import PetProfileCard from "@/components/molecules/PetProfileCard.vue";
import PetCard from "@/components/molecules/PetCard.vue";
import buttonTogglable from "@/components/atoms/buttonTogglable.vue";
import SelectAndOption from "@/components/atoms/SelectAndOption.vue";
</script>
<template>
    <!-- BUTTONS! -->
    <!-- You can add custom labels with label="Your Text Here"
    You can also add outline by adding outline="true"
    You can change colors by adding color="secondary"  -->
     <div class="row row-cols-3">
        <div class="col">
            <Button class="m-2" label="This is a custom text!">
            <i class="bi bi-heart-fill mx-1" ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="secondary">
            <i class="bi bi-heart-fill mx-1" ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="danger">
            <i class="bi bi-heart-fill mx-1"></i>
            </Button>
        </div>

        <div class="col">
            <Button class="m-2" label="This is a custom text!">
            </Button>
            <Button class="m-2" label="This is a custom text!" color="secondary">
            </Button>
            <Button class="m-2" label="This is a custom text!" color="danger">
            </Button>
        </div>

        <div class="col">
            <Button class="m-2" label="This is a custom text!" outline>
            <i class="bi bi-heart-fill mx-1 " ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="secondary" outline>
            <i class="bi bi-heart-fill mx-1 " ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="danger" outline>
            <i class="bi bi-heart-fill mx-1 "></i>
            </Button>
        </div>        
     </div>

     <!-- SEARCH BAR -->
<searchBar type="text" placeholder="Search..."> <i class="bi bi-search"></i>
</searchBar>

     <!-- PET CARD -->

<buttonTogglable></buttonTogglable>

<!-- select field with options -->
<SelectAndOption defaultLabel="Select an option..."
  :options="[
    { value: 'this', label: 'This' },
    { value: 'is', label: 'is' },
    { value: 'a test', label: 'a test' },
  ]"
></SelectAndOption>
</template>