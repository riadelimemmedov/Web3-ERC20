
#!Django modules and functions
from django.urls import path



#!Views and Serializers
from .views import *


#app_name and urlpattern
app_name = 'transfer'
urlpatterns = [
    path('create/',TransferListCreateView.as_view(),name='get-create-transfer'),
    path('get/<str:transfer_from>/',TransferGetView.as_view(),name='get-transfer')
]
