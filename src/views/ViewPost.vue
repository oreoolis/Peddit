<script setup lang="ts">
// view of a single post with comment section
import { Text } from 'vue';
import Comment  from '../components/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
const props = defineProps({
    title: {
        
        type: String,
        required: true,
        default: 'Best Meal for a Puppy'
    },
    username: {
        type: String,
        required: true,
        default: '@bernardcks'
    },
    content: {
        type: String,
        default: `When it comes to feeding a puppy, it's important to provide a balanced diet that supports their growth and development. Here are some of the best meal options for puppies:
                    1. High-Quality Puppy Food: Look for commercial puppy food that is specifically formulated for puppies. These foods contain the right balance of nutrients, including protein, fat, vitamins, and minerals, to support healthy growth.<br>
                    2. Protein-Rich Foods: Puppies need a higher protein intake than adult dogs. Good sources of protein include chicken, turkey, beef, lamb, and fish. Ensure that the meat is cooked thoroughly and free from bones.<br>
                    3. Healthy Carbohydrates: Include carbohydrates like rice, sweet potatoes, and oats in your puppy's diet. These provide energy and fiber for digestion.<br>
                    4. Fresh Vegetables: Adding vegetables like carrots, peas, and green beans can provide essential vitamins and minerals. Make sure to cook or steam them to make them easier to digest.<br>
                    5. Avoid Harmful Foods: Some human foods can be toxic to puppies, such as chocolate, grapes, onions, garlic, and caffeine. Always check with your vet before introducing new foods.<br>
                    6. Regular Feeding Schedule: Establish a regular feeding schedule with multiple small meals throughout the day to help with digestion and prevent overeating.<br>
                    Always consult with your veterinarian to determine the best diet plan for your specific puppy's breed, size, and health needs.`
    },
    likes: {
        type: Number,
        required: true,
        default: 1
    },
    comments: {
        type: Number,
        default: 1
    },
    shares: {
        type: Number,
        default: 1
    },
    commentsList: {
        type: Array,
        default: () => ([
            {   
                profilePic: "src/assets/person.jpg",
                username: "@janedoe",
                content: "Wow very insightful! Thanks for sharing!"
            },

            {   
                profilePic: "src/assets/person.jpg",
                username: "@TomBigW",
                content: "Amazing!!! +1"
            },
                        {   
                profilePic: "src/assets/person.jpg",
                username: "@Shannon",
                content: "Insane Post!!!"
            }
        ])
    }
});
</script>

<template>
    <main>
        <div>  
        <div class="w-75 mx-auto my-3 card">
            <div class="card-body">
                <h1 class="card-title headingFont fw-bold">{{ props.title }}</h1>
                <div class="d-flex align-items-center">
                    <img class="rounded-circle float-start pe-2" width="45" src="../assets/person.jpg" alt="">
                    <div>
                    <h4 class="card-subtitle mb-2 text-body-secondary fs-bold headingFont">{{ props.username }}</h4>                             
                    </div>
                </div>
                <p class="card-text mt-3 bodyFont" v-html="props.content">
                </p>
                <div class="d-flex justify-content-end"> 
                    <button class="btn  rounded-pill " type="button" id="LikeButton"><img src="../assets/Sprite/HomeIcons/Heart.png" alt=""> {{ props.likes }}</button>
                    <button class="btn  rounded-pill mx-3" type="button" id="CommentButton"><img src="../assets/Sprite/HomeIcons/Comment.png" alt=""> {{ props.comments }}</button>
                    <button class="btn  rounded-pill" type="button" id="ShareButton"><img src="../assets/Sprite/HomeIcons/Share.png" alt=""> {{ props.shares }}</button>
                </div>
                </div>
        </div>
        </div>
        <div class="w-75 card mx-auto" id="CommentSection">
             <comment v-for="comment in props.commentsList" v-bind:key="comment.username"
             :Name="comment.username"
             :Picture="comment.profilePic"
             :Content="comment.content"
             ></comment>
             <TextInput label="Add a comment..." @submit="handleCommentSubmit" />
        </div>

    </main>
</template>