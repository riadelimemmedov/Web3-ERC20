
#!Django modules and functions
from django.urls import path


#!Views and Serializers
from .views import *


#app_name and urlpattern
app_name = 'transaction'
urlpatterns = [
    path('create/',TransactionListCreateView.as_view(),name='get-create-transaction'),
    path('get/<str:transaction_from>/',TransactionGetView.as_view(),name='get-transaction')
]


