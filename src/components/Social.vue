<script setup>
import ProfileSearch from "../components/social/ProfileSearch.vue"
import PostSearch from "../components/social/PostSearch.vue"
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
             <div class="input-group w-75 mx-auto py-3 bodyFont">
            <button class="btn border rounded-start-pill" type="button" id="SearchButton"><img src="../assets/Sprite/HomeIcons/Search.png" alt=""></button>
            <input type="text" class="form-control rounded-end-pill " placeholder="Search" aria-label="Search" aria-describedby="visible-addon">
            <input type="text" class="form-control d-none " placeholder="Hidden input" aria-label="Hidden input" aria-describedby="visible-addon">
        </div>
        <div class="text-center headingFont fw-bold fs-1">Profiles</div>
        <div class="w-75 mx-auto" id="ProfileList">
            <!-- ProfileSearchResult -->
             <ProfileSearch v-for="profile in props.foundProfiles"
             :Name = "profile.Name"
             :Image = "profile.Image"
             ></ProfileSearch>
            <!-- ProfileSearchResult -->
        </div>
        <div class="text-center headingFont fw-bold fs-1">Posts</div>

        <div class="w-75 mx-auto" id="PostList">
            <!-- SimplePostSearchResult -->
             <PostSearch v-for="posts in foundPosts"
             :link="posts.link"
             :title="posts.title"
             :Name="posts.Name">
             </PostSearch>
            <!-- SimplePostSearchResult -->
        </div>
</template>