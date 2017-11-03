from django.contrib import admin
from .models import Ecocase, ESM, Vote, EcocaseImage
from django.forms import TextInput, Textarea
from django.db import models
from .forms import EcocaseForm
# Register your models here.


class ESMInline(admin.TabularInline):
    model = ESM
    extra = 0


class EcocaseAdmin(admin.ModelAdmin):
    # formfield_overrides = {
    #     models.CharField: {'widget': TextInput(attrs={'size': '20'})},
    #     models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 40})},
    # }
    fieldsets = [
        (None, {'fields': ['title']}),
        ('Ecocase characters', {'fields': [
         'promise', 'usage', 'organization', 'economic_transaction']}),
        ('Ecocase evaluation', {'fields': ['reference', 'direct_environmental_gain', 'indirect_environmental_gain',
                                           'attractiveness_price', 'proven_cas_or_project']}),
        ('Date information', {'fields': ['created_at', 'updated_at']})
    ]

    inlines = [ESMInline]
    list_display = ['title', 'created_at']
    list_filter = ['created_at']


admin.site.register(Ecocase, EcocaseAdmin)
admin.site.register(ESM)
admin.site.register(Vote)
admin.site.register(EcocaseImage)
