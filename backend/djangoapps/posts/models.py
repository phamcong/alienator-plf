from django.db import models
from django.db.models import Count
from authentication.models import Account


class PostQuerySet(models.QuerySet):
    def upvotes(self):
        return self.annotate(Count('postupvote'))\
            .order_by('-postupvote__count', '-created_at')

    def newest(self):
        return self.order_by('-created_at')

    def commentposts(self):
        return self.annotate(Count('commentpost'))\
            .order_by('-commentpost__count', '-created_at')


class Post(models.Model):
    author = models.ForeignKey(Account)
    title = models.CharField(max_length=110)
    link = models.URLField()

    created_at = models.DateTimeField(db_index=True, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    sorted_objects = PostQuerySet.as_manager()

    def __str__(self):
        return '{0}'.format(self.title)

    def _get_commentpost_count(self):
        return self.commentpost_set.count()
    commentpost_count = property(_get_commentpost_count)

    def _get_upvote_count(self):
        return self.postupvote_set.count()
    upvote_count = property(_get_upvote_count)

    class Meta:
        ordering = ['-created_at']


class CommentQuerySet(models.QuerySet):
    def upvotes(self):
        return self.annotate(Count('commentpostupvote'))\
            .order_by('-commentpostupvote__count', '-created_at')

    def newest(self):
        return self.order_by('-created_at')


class CommentPost(models.Model):
    post = models.ForeignKey(Post)
    author = models.ForeignKey(Account)
    content = models.CharField(max_length=110)
    created_at = models.DateTimeField(db_index=True, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    sorted_objects = CommentQuerySet.as_manager()

    def __str__(self):
        return '{0}'.format(self.content)

    def _get_upvote_count(self):
        return self.commentpostupvote_set.count()
    upvote_count = property(_get_upvote_count)

    class Meta:
        ordering = ['-created_at']


class PostUpvote(models.Model):
    post = models.ForeignKey(Post)
    voter = models.ForeignKey(Account)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'voter')


class CommentPostUpvote(models.Model):
    commentpostpost = models.ForeignKey(CommentPost)
    voter = models.ForeignKey(Account)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('commentpostpost', 'voter')
