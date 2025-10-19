<script setup>
const props = defineProps({
    link: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: "Title Text"
    },

    Name: {
        type: String,
        default: "@bernardcks"

    },
    Image:{
        type: String,
        default: "src/assets/person.jpg"
    }

})

const redir = (postId) => {
    location.href = "/viewpost/" + props.link;
};

</script>


<template>
    <div class="d-flex align-items-start rounded card btn" @click="redir">
        <div class="card-body">
            <h2 class="card-title">{{props.title}}</h2>
            <div class="d-flex align-items-start">
                <img class="rounded-circle float-start pe-2" width="45" :src=props.Image alt="">
                <div>
                <h6 class="card-subtitle text-body-secondary bodyFont">{{props.Name}}</h6>                             
                </div>

            </div>
        </div>
    </div>
</template>
<style scoped>
.card {
  background: linear-gradient(180deg, #fff, #fbfbfd);
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: 0 8px 20px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
  
}
.card:hover {
  transform: translateY(0px);
  box-shadow: 0 18px 44px rgba(11,22,40,0.14);
}
</style>