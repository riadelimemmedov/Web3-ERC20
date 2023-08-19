
#!Django and Django Rest
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


#!Models and Serializers class
from .models import Transfer
from approve.models import Approve
from blockchain_server.models import BlockChainServer
from approve.serializers import ApproveSerializer
from .serializers import TransferSerializer

# Create your views here.



#?TransferListCreateView
class TransferListCreateView(APIView):
    """Get All Transfer and Create Transfer"""
    
    #get
    def get(self,request,*args, **kwargs):
        try:
            transfers = Transfer.objects.all()
            serializer = TransferSerializer(transfers,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Transfer.DoesNotExist:
            return Response({'error':'Dont have exists any TRANSFER object in you database,please first add TRANSFER to database then run request again'},status=status.HTTP_404_NOT_FOUND)


    #post
    def post(self,request,*args, **kwargs):
        confirmed_account = request.data.get('transfer_approvement')
        try:
            approve_obj = Approve.objects.get(confirmed_account=confirmed_account)
            blockchain_server = BlockChainServer.objects.first()
        except Approve.DoesNotExist:
            return Response({'error': 'Approve or BlockChainServer object not found'}, status=status.HTTP_404_NOT_FOUND)
        
        
        request.data['transfer_approvement'] = approve_obj.pk
        request.data['is_transfer'] = True if request.data['confirmations'] == 1 else False
        request.data['blockchain_server'] = blockchain_server.server_name
        

        serializer = TransferSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#?TransferGetView
class TransferGetView(APIView):
    """Return a specific transfer""" 
    
    #get
    def get(self,request,transfer_from,*args,**kwargs):
        try:
            data = Transfer.objects.filter(transfer_from=transfer_from)    
            serializer = TransferSerializer(data,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Transfer.DoesNotExist:
                return Response({'error':'Transfer object not found'},status=status.HTTP_404_NOT_FOUND)
            