from rest_framework import serializers
from .models import Confession, Subscription, Post, Comment, Like
from accounts.serializers import UserSerializer


class ConfessionSerializer(serializers.ModelSerializer):
    admin_info = UserSerializer(source='admin', read_only=True)
    subscribers_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = Confession
        fields = ['id', 'name', 'slug', 'description', 'icon', 'admin', 'admin_info',
                  'is_active', 'subscribers_count', 'posts_count', 'is_subscribed', 'created_at']

    def get_subscribers_count(self, obj):
        return obj.subscribers.count()

    def get_posts_count(self, obj):
        return obj.posts.filter(is_active=True).count()

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Subscription.objects.filter(user=request.user, confession=obj).exists()
        return False


class PostSerializer(serializers.ModelSerializer):
    author_info = UserSerializer(source='author', read_only=True)
    confession_info = ConfessionSerializer(source='confession', read_only=True)
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'confession', 'confession_info', 'author', 'author_info', 'title',
                  'content', 'image', 'video', 'is_pinned', 'is_active', 'likes_count',
                  'comments_count', 'is_liked', 'created_at']

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False


class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['confession', 'title', 'content', 'image', 'video', 'is_pinned']


class CommentSerializer(serializers.ModelSerializer):
    author_info = UserSerializer(source='author', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_info', 'content', 'is_active', 'created_at']
        read_only_fields = ['author']
