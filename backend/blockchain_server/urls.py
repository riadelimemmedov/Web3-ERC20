
#!Django modules and functions
from django.urls import path



#!Views and Serializers
from .views import *


#app_name and urlpattern
app_name = 'blockchain_server'
urlpatterns = [
    path('get/server/name',ServerNameGetDisplayView.as_view(),name='get-server-name')
]
