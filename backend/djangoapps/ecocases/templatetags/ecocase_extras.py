from django import template
from ecocases.models import Ecocase, ESM, Vote
from django.contrib.auth.models import User

register = template.Library()


@register.filter
def get_vote_point_by_user(esm, user_id):
    vote_point = 0
    user = User.objects.get(pk=user_id)
    votes = Vote.objects.filter(esm=esm, user=user)

    if votes.count() > 0:
        vote_point = votes[0].vote_point

    print(vote_point)
    return vote_point


@register.filter
def is_voted(ecocase, user_id):
    esm = ecocase.esm_set.first()
    user = User.objects.get(pk=user_id)
    votes = Vote.objects.filter(esm=esm, user=user)
    if votes.count() == 0:
        return False
    else:
        return True


@register.filter
def concat_string(value_1, value_2):
    return str(value_1) + str(value_2)
