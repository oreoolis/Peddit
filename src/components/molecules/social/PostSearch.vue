<script setup>
import { computed } from 'vue';

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
    },
    created_at: {
      type: [String, Date],
      default: () => new Date().toISOString()
    }
})

const redir = (postId) => {
    location.href = "/viewpost/" + props.link;
};

// Parse and format created_at
const createdAtDate = computed(() => {
  if (!props.created_at) return null;
  const d = new Date(props.created_at);
  return isNaN(d.getTime()) ? null : d;
});

const formattedCreatedAt = computed(() => {
  const d = createdAtDate.value;
  if (!d) return '';
  // e.g. Oct 28, 2025, 10:51 AM
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });
});

const relativeCreatedAt = computed(() => {
  const d = createdAtDate.value;
  if (!d) return '';
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  // fallback to short date
  return d.toLocaleDateString();
});

</script>


<template>
    <div class="card post-card btn text-start p-0" @click="redir">
        <!-- Main Content: Title -->
    <div class="card-body pb-2">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <h5 class="mb-0 fw-bold">{{ props.title }}</h5>
        <small class="text-muted ms-2" :title="formattedCreatedAt">{{ relativeCreatedAt }}</small>
      </div>
      <slot></slot>
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