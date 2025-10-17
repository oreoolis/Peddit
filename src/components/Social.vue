<script setup>
import ProfileSearch from "../components/social/ProfileSearch.vue"
import PostSearch from "../components/social/PostSearch.vue"
import Button from "../components/atoms/button.vue"
const props = defineProps({
    foundProfiles:{
        type: Array,
        default:
            [
                {
                    Name: "@bernardcks",
                    Image: "/src/assets/person.jpg"
                },{
                    Name: "@johnDoe",
                    Image: "/src/assets/person.jpg"
                },{
                    Name: "@MaryJane",
                    Image: "/src/assets/person.jpg"
                }
            ]
    } ,
    foundPosts: {
        type: Array,
        default:[
            {
                link : 0,
                title: "Best Meal for a baby dog",
                Name: "@bernardcks",
                Image: "src/assets/person.jpg",
            },
            {
                link : 1,
                title: "Eat Healthier for cats!",
                Name: "@MaryJane",
                Image: "src/assets/person.jpg",
            },
            {
                link : 2,
                title: "Milk Brands for pets ranked",
                Name: "@johnDoe",
                Image: "src/assets/person.jpg",               
            },
        ]
    }
}
)
</script>


<template>
<div class="input-group w-75 mx-auto py-1 bodyFont rounded-pill my-3" style="box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <button class="input-group-text bg-transparent border-0 ps-3 pe-0">
        <img src="../assets/Sprite/HomeIcons/Search.png" alt="Search Icon" style="width: 16px; height: 16px;">
    </button>
    <input 
        type="text" 
        class="form-control bg-transparent border-0" 
        placeholder="Search" 
        aria-label="Search"
    >
</div>
  <section class="section w-75 mx-auto">
    <header class="section-header">
      <div class="badge mx-2">Profiles</div>
      <h2 class="section-title">Discover people</h2>
    </header>

    <div class="grid">
      <ProfileSearch
        v-for="(profile, idx) in props.foundProfiles"
        :key="profile.Name + '_' + idx"
        :Name="profile.Name"
        :Image="profile.Image"
        class="card card-profile"
      />
    </div>
  </section>



<section class="section mt-4 mx-auto w-75">
    <header class="section-header">
      <div class="badge badge-alt mx-2">Posts</div>
      <h2 class="section-title">Trending posts</h2>
    </header>

    <div class="grid">
      <PostSearch
        v-for="(post, idx) in props.foundPosts"
        :key="(post.link ?? idx) + '_post'"
        :link="post.link"
        :title="post.title"
        :Name="post.Name"
        class=""
      />
    </div>
  </section>

</template>
<style scoped>

/* Section header */
.section {
  margin-top: 1rem;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0.75rem;
}
.badge {
  background: linear-gradient(135deg,#ffdca3,#ffb86b);
  color: #3b2e14;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(255,165,60,0.16);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.badge-alt {
  background: linear-gradient(135deg,#c7f0ff,#7fd2ff);
  box-shadow: 0 6px 18px rgba(60,160,220,0.12);
}

/* Title styling */
.section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #112;
  text-shadow: 0 1px 0 rgba(255,255,255,0.6);
}

/* Grids */
.grid {
  display: grid;
  gap: 5px;
}


</style>