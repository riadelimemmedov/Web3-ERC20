
#!Django and Django Rest
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


#!Models and Serializers class
from .models import Transaction
from blockchain_server.models import BlockChainServer
from .serializers import TransactionSerializer

# Create your views here.


#?TransactionListCreateView
class TransactionListCreateView(APIView):
    """Get All Transaction and Create"""
    
    #get
    def get(self,request,*args,**kwargs):
        try:
            transactions = Transaction.objects.all()
            serializer = TransactionSerializer(transactions,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response({'error':'Dont have exists any TRANSACTION object in you database,please first add TRANSACTION to database then run request again'},status=status.HTTP_404_NOT_FOUND)
        
    
    #post
    def post(self,request,*args,**kwargs):
        try:
            blockchain_server = BlockChainServer.objects.first()
        except BlockChainServer.DoesNotExist:
            return Response({'error': 'BlockChainServer object not found'}, status=status.HTTP_404_NOT_FOUND)

        request.data['is_succsess'] = True if request.data['confirmations'] == 1 else False
        request.data['blockchain_server'] = blockchain_server.server_name
        
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    
    
#?TransactionGetView
class TransactionGetView(APIView):
    """Return a specific transaction"""
    
    def get(self,request,transaction_from,server_name,*args,**kwargs):
        try:
            data = Transaction.objects.filter(transaction_from=transaction_from,blockchain_server=server_name)
            serializer = TransactionSerializer(data,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Transaction.DoesNotExist:
            return Response({'error':'Transaction object not found'},status=status.HTTP_404_NOT_FOUND)