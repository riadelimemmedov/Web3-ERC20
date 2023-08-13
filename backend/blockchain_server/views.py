
#!Django and Django Rest
from django.shortcuts import render,Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse


#!Models and Serializers class
from .models import BlockChainServer
from .serializers import BlockChainServerSerializers

# Create your views here.



#*ServerNameGetDisplayView
class ServerNameGetDisplayView(APIView):
    """Get and Update BlockChainServer"""
    
    
    #get_object
    def get_object(self):
        try:
            server = BlockChainServer.objects.all().first()
            return server
        except  BlockChainServer.DoesNotExist:
            raise Http404('BlockChainServer object not found')
    
    
    #get
    def get(self,request,*args,**kwargs):
        try:
            data = self.get_object()
            serializer = BlockChainServerSerializers(data,many=False)
            return Response(data=serializer.data,status=status.HTTP_200_OK)
        except ValueError:
            return Response({'error':'Please try again get server api'},status=status.HTTP_404_NOT_FOUND)
        
        
    #put
    def put(self, request, *args, **kwargs):
        try:
            data_ = self.get_object()
            serializer = BlockChainServerSerializers(data_,data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(data=serializer.data,status=status.HTTP_204_NO_CONTENT)
        except ValueError:
            return Response({'error':'Please try again update server api'},status=status.HTTP_404_NOT_FOUND)