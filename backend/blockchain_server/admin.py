from django.contrib import admin
from .models import *
# Register your models here.


#!BlockChainServerModelAdmin
class BlockChainServerModelAdmin(admin.ModelAdmin):
    list_display = ['server_name']
    
    
#?register created custom model admin class to django admin interface
admin.site.register(BlockChainServer,BlockChainServerModelAdmin)