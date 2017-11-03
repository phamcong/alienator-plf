import datetime
from django import forms
from .models import Ecocase, ESM, EcocaseImage
from tinymce.widgets import TinyMCE
from django.contrib.admin import widgets
from django.contrib.auth import authenticate
from ecocases.variables import *
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


class EcocaseForm(forms.ModelForm):
    title = forms.CharField(max_length=200)

    promise = forms.CharField(widget=TinyMCE(
        attrs={'rows': 4, 'cols': 100}), max_length=2000)
    usage = forms.CharField(widget=TinyMCE(
        attrs={'rows': 4, 'cols': 100}), max_length=2000)
    organization = forms.CharField(widget=TinyMCE(
        attrs={'rows': 4, 'cols': 100}), max_length=2000)
    economic_transaction = forms.CharField(widget=TinyMCE(
        attrs={'rows': 4, 'cols': 100}), max_length=2000)

    reference = forms.CharField(max_length=100, required=False)
    direct_environmental_gain = forms.BooleanField(required=False)
    indirect_environmental_gain = forms.BooleanField(required=False)
    attractiveness_price = forms.BooleanField(required=False)
    proven_cas_or_project = forms.CharField(
        max_length=20, widget=forms.Select(choices=case_type_choices), required=False)

    class Meta:
        model = Ecocase
        fields = ('title', 'promise',
                  'usage', 'organization', 'economic_transaction',
                  'reference', 'direct_environmental_gain', 'indirect_environmental_gain',
                  'attractiveness_price', 'proven_cas_or_project')


class LoginForm(forms.Form):
    username = forms.CharField(label='User Name', max_length=64)
    password = forms.CharField(widget=forms.PasswordInput())

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError(
                "Sorry, that login was invalid. Please try again.")
        return self.cleaned_data

    def login(self, request):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        return user


class EcocaseImageForm(forms.Form):
    """Image upload form."""
    ecocase_image = forms.ImageField()

    class Meta:
        model = EcocaseImage
        fields = ('ecocase_image')


class SignupForm(UserCreationForm):
    email = forms.EmailField(max_length=200, help_text='Required')

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
