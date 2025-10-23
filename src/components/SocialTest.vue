<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '@/stores/postStore'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import ProfileSearch from "./molecules/social/ProfileSearch.vue"
import PostSearch from "./molecules/social/PostSearch.vue"

const postStore = usePostStore()
const userStore = useUserStore()
const { posts, loading: postsLoading } = storeToRefs(postStore)

const searchQuery = ref('')
const searchResults = ref({
  profiles: [],
  posts: []
})

// Fetch initial posts
onMounted(async () => {
  await postStore.fetchPosts({ publicOnly: true });
})

// Computed properties for real data
const foundProfiles = computed(() => {
  if (searchQuery.value) {
    // Filter profiles based on search (you'll need to implement profile search)
    return searchResults.value.profiles
  }
  // Return some sample profiles or recently active users
  return [
    {
      id: '1',
      username: '@bernardcks',
      display_name: 'Bernard',
      avatar_url: '/src/assets/person.jpg'
    },
    {
      id: '2', 
      username: '@johnDoe',
      display_name: 'John Doe',
      avatar_url: '/src/assets/person.jpg'
    },
    {
      id: '3',
      username: '@MaryJane', 
      display_name: 'Mary Jane',
      avatar_url: '/src/assets/person.jpg'
    }
  ]
})

const foundPosts = computed(() => {
  if (searchQuery.value) {
    // Return filtered posts based on search
    return searchResults.value.posts
  }
  // Return actual posts from store
  return postStore.posts.slice(0, 3).map(post => ({
    link: post.id,
    title: post.title || post.content?.substring(0, 50) + '...',
    Name: `@${post.profiles?.username || 'user'}`,
    Image: post.profiles?.avatar_url || '/src/assets/person.jpg',
    postData: post // Pass full post data for component use
  }))
})

// Search function
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = { profiles: [], posts: [] }
    return
  }

  try {
    // Search posts by title or content
    const { data: postResults, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          username,
          display_name,
          avatar_url
        )
      `)
      .or(`title.ilike.%${searchQuery.value}%,content.ilike.%${searchQuery.value}%`)
      .eq('is_public', true)
      .limit(5)

    if (!postError) {
      searchResults.value.posts = postResults || []
    }

    // Search profiles by username or display name
    const { data: profileResults, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${searchQuery.value}%,display_name.ilike.%${searchQuery.value}%`)
      .limit(5)

    if (!profileError) {
      searchResults.value.profiles = profileResults || []
    }

  } catch (error) {
    console.error('Search error:', error)
  }
}

// Handle search input
const handleSearch = () => {
  performSearch()
}
</script>

<template>
  <div class="social-page">
    <!-- Search Bar -->
    <div class="input-group w-75 mx-auto py-3 bodyFont">
      <button class="btn border rounded-start-pill" type="button" id="SearchButton">
        <img src="../assets/Sprite/HomeIcons/Search.png" alt="Search">
      </button>
      <input 
        type="text" 
        class="form-control rounded-end-pill" 
        placeholder="Search profiles or posts..." 
        v-model="searchQuery"
        @input="handleSearch"
        @keyup.enter="performSearch"
      >
    </div>

    <!-- Loading State -->
    <div v-if="postsLoading" class="text-center py-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Profiles Section -->
    <div v-else>
      <div class="text-center headingFont fw-bold fs-1">Profiles</div>
      <div class="w-75 mx-auto" id="ProfileList">
        <ProfileSearch 
          v-for="profile in foundProfiles"
          :key="profile.id"
          :Name="profile.username"
          :displayName="profile.display_name"
          :Image="profile.avatar_url"
          :profileId="profile.id"
        />
        
        <div v-if="foundProfiles.length === 0 && searchQuery" class="text-center text-muted py-3">
          No profiles found
        </div>
      </div>

      <!-- Posts Section -->
      <div class="text-center headingFont fw-bold fs-1">Posts</div>
      <div class="w-75 mx-auto" id="PostList">
        <PostSearch 
          v-for="post in foundPosts"
          :key="post.link"
          :link="post.link"
          :title="post.title"
          :Name="post.Name"
          :Image="post.Image"
          :postData="post.postData"
        />
        
        <div v-if="foundPosts.length === 0 && searchQuery" class="text-center text-muted py-3">
          No posts found
        </div>
        
        <div v-if="foundPosts.length === 0 && !searchQuery" class="text-center text-muted py-3">
          No posts yet. Be the first to post!
        </div>
      </div>
    </div>
  </div>
</template>