
from django.db import models
import datetime
from django.utils import timezone
from django.forms import TextInput, Textarea
from django.core.files.storage import FileSystemStorage
from tinymce import models as tinymce_models
# from django.contrib.auth.models import User
from authentication.models import Account
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator
from django import template
from django.utils.timezone import now
from ecocases.variables import *

from django.db.models import Count
from authentication.models import Account

# Create your models here.

register = template.Library()
default_account = Account.objects.get(username='admin')


class EcocaseQuerySet(models.QuerySet):
    def upvotes(self):
        return self.annotate(Count('ecocaseupvote'))\
            .order_by('-ecocaseupvote__count', '-created_at')

    def newest(self):
        return self.order_by('-created_at')

    def comments(self):
        return self.annotate(Count('comment'))\
            .order_by('-comment__count', '-created_at')


# def make_upload_path(instance, filename):
#     file_root, file_ext = os.path.splitext(filename)
#     dir

class Ecocase(models.Model):
    author = models.ForeignKey(Account)

    title = models.CharField(max_length=200)

    promise = tinymce_models.HTMLField()
    usage = tinymce_models.HTMLField()
    organization = tinymce_models.HTMLField()
    economic_transaction = tinymce_models.HTMLField(default='')

    reference = models.CharField(max_length=100, blank=True, null=True)
    direct_environmental_gain = models.NullBooleanField(null=True)
    indirect_environmental_gain = models.NullBooleanField(null=True)
    attractiveness_price = models.NullBooleanField(null=True)
    proven_cas_or_project = models.CharField(
        max_length=20, choices=case_type_choices, default='project')

    created_at = models.DateTimeField(db_index=True, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    sorted_objects = EcocaseQuerySet.as_manager()

    def __str__(self):
        return '{0}'.format(self.title)

    def _get_comment_count(self):
        return self.comment_set.count()
    comment_count = property(_get_comment_count)

    def _get_upvote_count(self):
        return self.ecocaseupvote_set.count()
    upvote_count = property(_get_upvote_count)

    class Meta:
        ordering = ['-created_at']

    def image_url_list(self):
        if self.image_urls != None:
            return self.image_urls.split(';')
        else:
            return ""

    def first_image_url(self):
        if self.image_urls != None:
            return self.image_urls.split(';')[0]
        else:
            return ""

    def first_image(self):
        if self.ecocaseimage_set.all() != None:
            return self.ecocaseimage_set.all()[0]
        else:
            return ""

    def get_absolute_url(self):
        return reverse('ecocases:detail', args=[str(self.id)])

    def get_short_title(self):
        if len(self.title) < 60:
            return self.title
        else:
            return (self.title[:60] + '..')


class CommentQuerySet(models.QuerySet):
    def upvotes(self):
        return self.annotate(Count('commentupvote'))\
            .order_by('-commentupvote__count', '-created_at')

    def newest(self):
        return self.order_by('-created_at')


class Comment(models.Model):
    ecocase = models.ForeignKey(Ecocase)
    author = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name='comment_author')
    content = models.CharField(max_length=110)
    created_at = models.DateTimeField(db_index=True, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = models.Manager()
    sorted_objects = CommentQuerySet.as_manager()

    def __str__(self):
        return '{0}'.format(self.content)

    def _get_upvote_count(self):
        return self.commentupvote_set.count()
    upvote_count = property(_get_upvote_count)

    class Meta:
        ordering = ['-created_at']


class EcocaseUpvote(models.Model):
    ecocase = models.ForeignKey(Ecocase)
    voter = models.ForeignKey(Account)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('ecocase', 'voter')


class CommentUpvote(models.Model):
    comment = models.ForeignKey(Comment)
    voter = models.ForeignKey(Account, related_name='comment_voter')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('comment', 'voter')


class ESM(models.Model):
    ecocase = models.ForeignKey(Ecocase, on_delete=models.CASCADE)
    type = models.IntegerField(default=1)

    def __str__(self):
        return '{0}'.format(esm_dict[str(self.type)])

    def get_title(self):
        return esm_dict[str(self.type)]

    def get_vote_point_total(self):
        vote_point_total = 0
        for vote in self.vote_set.all():
            vote_point_total += vote.vote_point
        return vote_point_total

    def vote_point_options(self):
        return vote_point_options


class ESMUpvote(models.Model):
    esm = models.ForeignKey(ESM)
    voter = models.ForeignKey(Account)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('esm', 'voter')


class Vote(models.Model):
    esm = models.ForeignKey(ESM, on_delete=models.CASCADE)
    voter = models.ForeignKey(
        Account, on_delete=models.CASCADE, default=default_account.id)
    vote_point = models.IntegerField(
        default=0,
        validators=[MaxValueValidator(16), MinValueValidator(0)]
    )

    def __str__(self):
        return 'ESM' + str(self.esm.type) + '_' + str(self.voter) + ':' + str(self.vote_point)


class EcocaseImage(models.Model):
    prefix = models.CharField(max_length=200, default='')
    ecocase = models.ForeignKey(Ecocase, on_delete=models.CASCADE)
    ecocase_image = models.ImageField(
        upload_to='ecocases/images/', default='ecocases/images/no-image.jpg')

    def __str__(self):
        return "../media/" + str(self.ecocase_image)
