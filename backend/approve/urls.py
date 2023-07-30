
#!Django modules and functions
from django.urls import path



#!Views and Serializers
from .views import *


#app_name and urlpattern
app_name = 'approve'
urlpatterns = [
    path('create/',ApproveListCreateView.as_view(),name='get-create-approve'),
    path('get/<str:slug>/',ApproveGetView.as_view(),name='get-approve')
]
