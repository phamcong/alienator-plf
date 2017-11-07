from rest_framework import serializers
from rest_framework.serializers import HyperlinkedRelatedField

from authentication.serializers import UserSerializer
from authentication.models import Account
from ecocases.models import Ecocase, Comment, EcocaseUpvote, CommentUpvote


class EcocaseSerializer(serializers.ModelSerializer):
    author = UserSerializer(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = Ecocase
        fields = ('id', 'author', 'title', 'promise', 'usage', 'organization', 'economic_transaction',
                  'reference', 'direct_environmental_gain', 'indirect_environmental_gain', 'attractiveness_price',
                  'proven_cas_or_project', 'created_at', 'updated_at',
                  'comment_count', 'upvote_count')
        read_only_fields = ('id', 'created_at', 'updated_at',
                            'comment_count', 'upvote_count')

    def to_representation(self, obj):
        returnObj = super(EcocaseSerializer, self).to_representation(obj)
        is_upvoted_me = False
        is_author_me = False
        if isinstance(self.context['request'].user, Account):
            is_upvoted_me = obj.ecocaseupvote_set.filter(
                voter=self.context['request'].user).exists()
            is_author_me = obj.author == self.context['request'].user

        newObj = {
            'is_author_me': is_author_me,
            'is_upvoted_me': is_upvoted_me
        }
        returnObj.update(newObj)
        return returnObj


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'ecocase', 'author', 'content', 'created_at', 'updated_at',
                  'upvote_count')
        read_only_fields = ('id', 'created_at', 'updated_at', 'upvote_count')

    def to_representation(self, obj):
        returnObj = super(CommentSerializer, self).to_representation(obj)
        is_upvoted_me = False
        is_author_me = False
        if isinstance(self.context['request'].user, Account):
            is_upvoted_me = obj.commentupvote_set.filter(
                voter=self.context['request'].user).exists()
            is_author_me = obj.author == self.context['request'].user

        newObj = {
            'is_author_me': is_author_me,
            'is_upvoted_me': is_upvoted_me
        }
        returnObj.update(newObj)
        return returnObj


class EcocaseUpvoteSerializer(serializers.ModelSerializer):
    voter = UserSerializer(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = EcocaseUpvote
        fields = ('id', 'ecocase', 'voter', 'created_at')
        read_only_fields = ('id', 'created_at')


class CommentUpvoteSerializer(serializers.ModelSerializer):
    voter = UserSerializer(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = CommentUpvote
        fields = ('id', 'comment', 'voter', 'created_at')
        read_only_fields = ('id', 'created_at')


class ESMUpvoteSerializer(serializers.ModelSerializer):
    voter = UserSerializer(
        default=serializers.CurrentUserDefault(), read_only=True)

    class Meta:
        model = EcocaseUpvote
        fields = ('id', 'esm', 'voter', 'created_at')
        read_only_fields = ('id', 'created_at')
