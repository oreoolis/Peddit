<script setup>
import { useTimeAgo } from '@vueuse/core';
import { toRef, ref, computed } from 'vue';

const props = defineProps({
    Name:{ type: String, default: '@bernardcks' },
    Picture:{ type: String, default: 'src/assets/person.jpg' },
    Content:{ type: String, default: 'Wow very insightful! Thanks for sharing!' },
    timestamp:{ type: String, default: "2025-10-20 15:00:00+00" }
});

const timeAgo = useTimeAgo(toRef(props, 'timestamp'));

// show-more logic for long comments
const expanded = ref(false);
const MAX_PREVIEW = 350;
const isLong = computed(() => (props.Content || '').length > MAX_PREVIEW);
const previewText = computed(() => {
    const text = props.Content || '';
    if (!isLong.value) return text;
    return expanded.value ? text : (text.slice(0, MAX_PREVIEW).trimEnd() + '…');
});
</script>

<template>
    <div class="comment-ghost-item">
        <div class="comment-header d-flex align-items-center gap-2 mb-2">
            <img class="avatar rounded-circle" :src="props.Picture" alt="User Avatar">
            <span class="fw-bold headingFont ">{{ props.Name }}</span>
            <span class="text-muted small">·</span>
            <small class="text-muted">{{ timeAgo }}</small>
        </div>
        <div class="comment-body fs-4">
            <div class="thread-line"></div>
            <p class="bodyFont mb-0" style="white-space: pre-wrap;">
                {{ previewText }}
                <template v-if="isLong">
                    <a href="#" @click.prevent="expanded = !expanded" class="ms-2 small text-decoration-none">
                        {{ expanded ? 'Show less' : 'Show more' }}
                    </a>
                </template>
            </p>
        </div>
    </div>
</template>

<style scoped>
.comment-ghost-item {
    padding: 0.5rem 1rem;
}
.avatar {
    width: 40px;
    height: 40px;
    object-fit: cover;
}
.comment-body {
    position: relative;
    padding-left: 48px; /* Aligns with name */
}
.thread-line {
    position: absolute;
    left: 11px; /* Aligns with avatar center */
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--bs-primary);
    opacity: 0; /* Hidden by default */
    transition: opacity 0.2s ease;
}
.comment-ghost-item:hover .thread-line {
    opacity: 1; /* Show on hover */
}
</style>