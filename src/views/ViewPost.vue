<script setup>
// view of a single post with comment section
import { onMounted, Text } from 'vue';
import Comment  from '../components/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/commentStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

// const props = defineProps({
//     title: {
        
//         type: String,
//         required: true,
//         default: 'Best Meal for a Puppy'
//     },
//     username: {
//         type: String,
//         required: true,
//         default: '@bernardcks'
//     },
//     content: {
//         type: String,
//         default: `When it comes to feeding a puppy, it's important to provide a balanced diet that supports their growth and development. Here are some of the best meal options for puppies:
//                     1. High-Quality Puppy Food: Look for commercial puppy food that is specifically formulated for puppies. These foods contain the right balance of nutrients, including protein, fat, vitamins, and minerals, to support healthy growth.<br>
//                     2. Protein-Rich Foods: Puppies need a higher protein intake than adult dogs. Good sources of protein include chicken, turkey, beef, lamb, and fish. Ensure that the meat is cooked thoroughly and free from bones.<br>
//                     3. Healthy Carbohydrates: Include carbohydrates like rice, sweet potatoes, and oats in your puppy's diet. These provide energy and fiber for digestion.<br>
//                     4. Fresh Vegetables: Adding vegetables like carrots, peas, and green beans can provide essential vitamins and minerals. Make sure to cook or steam them to make them easier to digest.<br>
//                     5. Avoid Harmful Foods: Some human foods can be toxic to puppies, such as chocolate, grapes, onions, garlic, and caffeine. Always check with your vet before introducing new foods.<br>
//                     6. Regular Feeding Schedule: Establish a regular feeding schedule with multiple small meals throughout the day to help with digestion and prevent overeating.<br>
//                     Always consult with your veterinarian to determine the best diet plan for your specific puppy's breed, size, and health needs.`
//     },
//     likes: {
//         type: Number,
//         required: true,
//         default: 1
//     },
//     comments: {
//         type: Number,
//         default: 1
//     },
//     shares: {
//         type: Number,
//         default: 1
//     },
//     commentsList: {
//         type: Array,
//         default: () => ([
//             {   
//                 profilePic: "src/assets/person.jpg",
//                 username: "@janedoe",
//                 content: "Wow very insightful! Thanks for sharing!"
//             },

//             {   
//                 profilePic: "src/assets/person.jpg",
//                 username: "@TomBigW",
//                 content: "Amazing!!! +1"
//             },
//                         {   
//                 profilePic: "src/assets/person.jpg",
//                 username: "@Shannon",
//                 content: "Insane Post!!!"
//             }
//         ])
//     }
// });

const router = useRouter();

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const postStore = usePostStore();
const { loading, currentPost } = storeToRefs(postStore);

const commentStore = useCommentStore();
const { submitting, comments } = storeToRefs(commentStore)

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const userStore = useUserStore();
const { profile: authorProfile } = storeToRefs(userStore);

onMounted(async () =>{
    if (props.postId) {
        await postStore.fetchPostById(props.postId);
        await commentStore.fetchCommentsByPostID(props.postId);
        console.log(currentPost.value);
    } else {
        router.push('/');
    }
});

const handleCommentSubmit = async (content) => {
    if (!user.value || !authorProfile.value) {
        console.error("User is not logged in or profile not loaded.");
        return;
    }

    console.log("Creating comment with content:", content);

    const result = await commentStore.createComment({
        postId: props.postId,
        authorId: user.value.id,
        content: content,
        authorProfile: authorProfile.value
    });

    if (!result.success) {
        // You could show a toast notification here with result.error
        console.error('Failed to submit comment:', result.error);
    }
};
</script>

<template>
    <main>
        <div>  
        <div v-if="currentPost" class="w-75 mx-auto my-3 card">
            <div class="card-body">
                <h1 class="card-title headingFont fw-bold">{{ currentPost.title }}</h1>
                <div class="d-flex align-items-center">
                    <img class="rounded-circle float-start pe-2" width="45" :src="currentPost.profiles.avatar_url" alt="">
                    <div>
                    <h4 class="card-subtitle mb-2 text-body-secondary fs-bold headingFont">{{ currentPost.profiles.display_name }}</h4>                             
                    </div>
                </div>
                <p class="card-text mt-3 bodyFont" v-html="currentPost.content">
                </p>
                <div class="d-flex justify-content-end"> 
                    <button class="btn  rounded-pill " type="button" id="LikeButton"><img src="../assets/Sprite/HomeIcons/Heart.png" alt=""> {{ currentPost.likes }}</button>
                    <button class="btn  rounded-pill mx-3" type="button" id="CommentButton"><img src="../assets/Sprite/HomeIcons/Comment.png" alt=""> {{ currentPost.comments }}</button>
                    <button class="btn  rounded-pill" type="button" id="ShareButton"><img src="../assets/Sprite/HomeIcons/Share.png" alt=""> {{ currentPost.shares }}</button>
                </div>
                </div>
        </div>
        </div>
        <div v-if="comments" class="w-75 card mx-auto" id="CommentSection">
             <Comment 
                v-for="comment in comments" 
                v-bind:key="comment.id"
                :Name="comment.profiles.display_name"
                :Picture="comment.profiles.avatar_url"
                :Content="comment.content"
             />
             <TextInput 
                label="Add a comment..." 
                @submit="handleCommentSubmit" 
                :disabled="submitting"
            />
        </div>

    </main>
</template>