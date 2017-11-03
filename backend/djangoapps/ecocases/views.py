from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status

from ecocases.models import Ecocase, ESM, Comment, EcocaseUpvote, CommentUpvote
from ecocases.permissions import IsAuthor, IsOwner
from ecocases.serializers import EcocaseSerializer, CommentSerializer, \
    EcocaseUpvoteSerializer, CommentUpvoteSerializer
from rest_framework.decorators import detail_route
from django.core.exceptions import ObjectDoesNotExist


class EcocaseViewSet(viewsets.ModelViewSet):
    serializer_class = EcocaseSerializer

    def get_queryset(self):
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Ecocase.sorted_objects.upvotes()
        elif sorting == 'newest':
            return Ecocase.sorted_objects.newest()
        elif sorting == 'comments':
            return Ecocase.sorted_objects.comments()
        else:
            return Ecocase.sorted_objects.upvotes()

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthor(),)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upvote(self, request, pk=None):
        serializer = EcocaseUpvoteSerializer(data={'ecocase': pk},
                                             context={'request': request})
        if serializer.is_valid():
            serializer.save()
            ecocase = Ecocase.objects.get(pk=pk)
            return Response(EcocaseSerializer(ecocase, context={'request': request}).data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel_upvote(self, request, pk=None):
        try:
            ecocase = Ecocase.objects.get(pk=pk)
            instance = EcocaseUpvote.objects.get(
                ecocase=ecocase, voter=self.request.user)
            self.perform_destroy(instance)
            return Response(EcocaseSerializer(ecocase, context={'request': request}).data)
        except ObjectDoesNotExist:
            return Response({
                'status': 'Not Fount',
                'message': 'This upvote is not exist.'
            }, status=status.HTTP_404_NOT_FOUND)


class UserEcocaseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EcocaseSerializer

    def get_queryset(self):
        user_id = self.kwargs['userid']
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Ecocase.sorted_objects.upvotes().filter(author=user_id)
        elif sorting == 'newest':
            return Ecocase.sorted_objects.newest().filter(author=user_id)
        elif sorting == 'comments':
            return Ecocase.sorted_objects.comments().filter(author=user_id)
        else:
            return Ecocase.sorted_objects.upvotes().filter(author=user_id)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Comment.sorted_objects.upvotes()
        elif sorting == 'newest':
            return Comment.sorted_objects.newest()
        else:
            return Comment.sorted_objects.upvotes()

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAuthor(),)

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        return super(CommentViewSet, self).perform_create(serializer)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upvote(self, request, pk=None):
        serializer = CommentUpvoteSerializer(data={'comment': pk},
                                             context={'request': request})
        if serializer.is_valid():
            serializer.save()
            comment = Comment.objects.get(pk=pk)
            return Response(CommentSerializer(comment, context={'request': request}).data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @detail_route(methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel_upvote(self, request, pk=None):
        try:
            comment = Comment.objects.get(pk=pk)
            instance = CommentUpvote.objects.get(
                comment=comment, voter=self.request.user)
            self.perform_destroy(instance)
            return Response(CommentSerializer(comment, context={'request': request}).data)
        except ObjectDoesNotExist:
            return Response({
                'status': 'Not Fount',
                'message': 'This upvote is not exist.'
            }, status=status.HTTP_404_NOT_FOUND)


class EcocaseCommentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        ecocase_id = self.kwargs['ecocaseid']
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Comment.sorted_objects.upvotes().filter(ecocase=ecocase_id)
        elif sorting == 'newest':
            return Comment.sorted_objects.newest().filter(ecocase=ecocase_id)
        else:
            return Comment.sorted_objects.upvotes().filter(ecocase=ecocase_id)


class UserCommentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        user_id = self.kwargs['userid']
        sorting = self.request.query_params.get('sorting', None)
        if sorting == 'upvotes':
            return Comment.sorted_objects.upvotes().filter(author=user_id)
        elif sorting == 'newest':
            return Comment.sorted_objects.newest().filter(author=user_id)
        else:
            return Comment.sorted_objects.upvotes().filter(author=user_id)
