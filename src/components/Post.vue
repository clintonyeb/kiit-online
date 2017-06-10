<template>
    <div class="event">
        <div class="label">
            <img :src="user.avatar">
        </div>
        <div class="content">
            <div class="summary">
                <a class="avatar">
                    {{user.fullName}}
                </a> {{post.title}}
                <div class="date">
                    {{date}}
                </div>
            </div>
            <div class="extra text" v-if="post.content">
                {{post.content}}
            </div>
            <div class="extra images" v-for="file in post.files">
                <a>
                    <img :src="file">
                </a>
            </div>
            <div class="meta">
                <a class="like">
                    <i class="like icon"></i> 4 Comments
                </a>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['post'],
    name: 'post',
    data() {
        return {}
    },
    computed: {
        comments: function () {
            switch (this.slide.comments) {
                case 0:
                    return 'No comments'
                case 1:
                    return '1 comment'
                default:
                    return 'No comments'
            }
        },
        user() {
            return this.post.user
        },
        avatar() {
            return this.user.avatar || '/assets/avatar-default.png';
        }
    }
}
</script>

<style scoped>
.card {
    width: 100%;
    max-width: 700px;
}

.card {
    margin-bottom: 5px;
}

.header {
    padding: 10px;
}

.title {
    font-weight: bolder;
    text-shadow: 1px 1px 3px #000;
}

.date {
    font-size: .9rem;
    font-style: italic;
}

#user:hover {
    color: #000;
}

.comments {
    margin-left: 5px;
    border-bottom: 1px solid #03A9F4;
}

#user {
    border-bottom: 1px solid #03A9F4;
}
</style>


