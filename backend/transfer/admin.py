from django.contrib import admin
from .models import *
# Register your models here.



#!TransferModelAdmin
class TransferModelAdmin(admin.ModelAdmin):
    list_display = ['transfer_from','transfer_to','transfer_hash','transfer_amount','is_transfer','confirmations','created','modified','transfer_slug']
    list_display_links = ['transfer_from','transfer_to','transfer_hash']
    
    
#?register created custom model admin class to django admin interface
admin.site.register(Transfer,TransferModelAdmin)