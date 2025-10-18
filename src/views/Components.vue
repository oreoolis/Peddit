<script setup>
import Button from "../components/atoms/button.vue"
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
            <Button class="m-2" label="This is a custom text!" outline="true">
            <i class="bi bi-heart-fill mx-1 " ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="secondary" outline="true">
            <i class="bi bi-heart-fill mx-1 " ></i>
            </Button>
            <Button class="m-2" label="This is a custom text!" color="danger" outline="true">
            <i class="bi bi-heart-fill mx-1 "></i>
            </Button>
        </div>        
     </div>


</template>