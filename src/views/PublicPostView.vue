<script setup>
// Assets
import personImage from '../assets/person.jpg';
// Components
import PetProfileCard from '@/components/PetProfileCard.vue';
// Stores
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { useFollowStore } from '@/stores/followStore';
// Others
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '@/stores/postStore';
import { useCommentStore } from '@/stores/commentStore';
import { useStorage } from '@/composables/useStorage';

const props = defineProps({
  postId: {
    type: String,
    required: true
  }
});

const postStore = usePostStore();
const { loading, currentPost } = storeToRefs(postStore);

const commmentStore = useCommentStore();
const { comments } = storeToRefs(commmentStore)

const profileStore = useProfileStore();
const {} = storeToRefs(profileStore);

onMounted(async () =>{
    if (props.postId) {
        await postStore.fetchPostById(props.postId);
        await commmentStore.fetchCommentsByPostID(props.postId);
        console.log(currentPost.value);
    } else {
        router.push('/');
    }
});
const parame = ref('');
</script>

<template>
    <div v-if="currentPost">
        <h2>{{ currentPost.title }}</h2>
        <h3>{{ currentPost.author }}</h3>
        <img :src="currentPost.profiles.avatar_url">
        <p>{{ currentPost.content }}</p>
        <div v-for="comment in comments">
            <h2>{{ comment.profiles.display_name }}</h2>
            <img :src="comment.profiles.avatar_url">
            <p>{{ comment.content }}</p>
        </div>
    </div>
</template>

<style scoped>

</style>