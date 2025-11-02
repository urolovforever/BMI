from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Confession, Post, Comment, Like, Subscription
from .serializers import (
    ConfessionSerializer, PostSerializer, PostCreateSerializer, CommentSerializer
)


class ConfessionViewSet(viewsets.ModelViewSet):
    queryset = Confession.objects.filter(is_active=True)
    serializer_class = ConfessionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'get_posts']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['get'])
    def get_posts(self, request, pk=None):
        confession = self.get_object()
        posts = Post.objects.filter(confession=confession, is_active=True)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        confession = self.get_object()
        if Subscription.objects.filter(user=request.user, confession=confession).exists():
            return Response({'message': 'Allaqachon obuna bo\'lgansiz!'}, status=status.HTTP_400_BAD_REQUEST)
        Subscription.objects.create(user=request.user, confession=confession)
        return Response({'message': 'Obuna bo\'ldingiz!'})

    @action(detail=True, methods=['post'])
    def unsubscribe(self, request, pk=None):
        confession = self.get_object()
        subscription = Subscription.objects.filter(user=request.user, confession=confession).first()
        if not subscription:
            return Response({'error': 'Obuna topilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
        subscription.delete()
        return Response({'message': 'Obuna bekor qilindi!'})

    @action(detail=False, methods=['get'])
    def my_subscriptions(self, request):
        subscriptions = Subscription.objects.filter(user=request.user)
        confessions = [sub.confession for sub in subscriptions]
        serializer = ConfessionSerializer(confessions, many=True, context={'request': request})
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(is_active=True)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def feed(self, request):
        subscriptions = Subscription.objects.filter(user=request.user)
        confession_ids = subscriptions.values_list('confession_id', flat=True)
        posts = Post.objects.filter(confession_id__in=confession_ids, is_active=True)
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        if Like.objects.filter(user=request.user, post=post).exists():
            return Response({'message': 'Allaqachon like qo\'ygansiz!'}, status=status.HTTP_400_BAD_REQUEST)
        Like.objects.create(user=request.user, post=post)
        return Response({'message': 'Like qo\'yildi!'})

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        post = self.get_object()
        like = Like.objects.filter(user=request.user, post=post).first()
        if not like:
            return Response({'error': 'Like topilmadi!'}, status=status.HTTP_400_BAD_REQUEST)
        like.delete()
        return Response({'message': 'Like olib tashlandi!'})


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.filter(is_active=True)
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
