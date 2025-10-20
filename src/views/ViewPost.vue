<script setup>
// view of a single post with comment section
import { onMounted, Text } from 'vue';
import Comment  from '../components/social/Comment.vue';
import TextInput from '@/components/atoms/TextInput.vue';
import searchBar from '@/components/atoms/searchBar.vue';
import { usePostStore } from '@/stores/postStore';
import { storeToRefs } from 'pinia';
import { useCommentStore } from '@/stores/commentStore';
import { useProfileStore } from '@/stores/profileStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';


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