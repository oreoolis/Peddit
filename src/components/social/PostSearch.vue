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
    },
    CommentCount:{
        type: Number,
        default: 0
    },
    VoteScore:{
        type: Number,
        default: 0
    }
})

const redir = (postId) => {
    location.href = "/viewpost/" + props.link;
};

</script>


<template>
    <div class="card post-card btn text-start p-0" @click="redir">
        <!-- Main Content: Title -->
        <div class="card-body pb-2">
            <h5 class="card-title fw-bold mb-0">{{ props.title }}</h5>
        </div>

        <!-- Footer: Author and Stats -->
        <div class="card-footer d-flex align-items-center justify-content-between bg-transparent border-0 pt-1 pb-2">
            <!-- Author Info -->
            <div class="d-flex align-items-center gap-2">
                <img class="avatar rounded-circle" :src="props.Image" alt="author avatar">
                <span class="card-subtitle text-body-secondary bodyFont small fw-medium">{{ props.Name }}</span>
            </div>

            <!-- Post Stats -->
            <div class="d-flex align-items-center gap-3 post-stats">
                <div class="stat-item" title="Votes">
                    <i class="bi bi-arrow-up"></i>
                    <span class="px-1 fw-bold">{{ props.VoteScore }}</span>
                </div>
                <div class="stat-item p-1" title="Comments">
                    <i class="bi bi-chat-left-text"></i>
                    <span class="px-1 fw-bold">{{ props.CommentCount }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.post-card {
  background: linear-gradient(180deg, #fff, #fbfbfd);
  transition: transform 180ms ease, box-shadow 180ms ease;
  box-shadow: 0 8px 20px rgba(15,23,42,0.06);
  overflow: hidden;
  position: relative;
  border: none;
}
.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(11, 22, 40, 0.1);
}
.post-card::before { /* Shine animation */
  content: "";
  position: absolute;
  top: 0; left: -150%;
  width: 75%; height: 100%;
  background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  transform: skewX(-25deg);
  transition: left 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1;
}
.post-card:hover::before { left: 150%; }

.avatar {
  width: 24px;
  height: 24px;
  object-fit: cover;
}

.post-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.85rem;
  color: var(--bs-secondary-color);
}
.post-stats .stat-item .bi {
  font-size: 1.1rem;
  line-height: 1;
}

.vote-block {
  line-height: 1;
  color: var(--bs-secondary-color);
}
.vote-block .bi {
  font-size: 1.2rem;
}
.vote-block span {
  font-size: 0.9rem;
}

</style>