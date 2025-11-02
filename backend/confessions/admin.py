from django.contrib import admin
from .models import Confession, Subscription, Post, Comment, Like


@admin.register(Confession)
class ConfessionAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'admin', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "admin":
            kwargs["queryset"] = admin.get_user_model().objects.filter(role='confession_admin')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'confession', 'subscribed_at']
    list_filter = ['confession', 'subscribed_at']
    search_fields = ['user__username', 'confession__name']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'confession', 'author', 'is_pinned', 'is_active', 'created_at']
    list_filter = ['confession', 'is_pinned', 'is_active', 'created_at']
    search_fields = ['title', 'content', 'author__username']
    readonly_fields = ['created_at', 'updated_at', 'likes_count', 'comments_count']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['content', 'author__username', 'post__title']


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'post__title']
