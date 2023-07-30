from django.contrib import admin
from .models import *
# Register your models here.


#!ApproveModelAdmin
class ApproveModelAdmin(admin.ModelAdmin):
    list_display = ['confirming_account','confirmed_account','approvment_hash','amount','is_approve','confirmations','created','modified','approvment_slug']
    list_display_links = ['confirming_account','confirmed_account','approvment_hash']
    
    
#?register created custom model admin class to django admin interface
admin.site.register(Approve,ApproveModelAdmin)