
#!Django and Django Rest
from django.shortcuts import render,get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


#!Models and Serializers class
from .models import Approve
from .serializers import ApproveSerializer

# Create your views here.



#?ApproveView
class ApproveListCreateView(APIView):
    
    #get
    def get(self,request,*args, **kwargs):
        try:
            approvments = Approve.objects.all()
            serializer = ApproveSerializer(approvments,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Approve.DoesNotExist:
            return Response({'error':'Dont have exists any approve object in you database,please first add approve to database then run request again'},status=status.HTTP_404_NOT_FOUND)


    #post
    def post(self,request,*args,**kwargs):  
        request.data['is_approve'] = True if request.data['confirmations'] == 1 else False
        serializer = ApproveSerializer(data=request.data)
        if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


#?ApproveGetView
class ApproveGetView(APIView):
    
    #get
    def get(self,request,slug,*args,**kwargs):
        """Return a approved user""" 
        print('Slug is ', slug)
        try:
            data = get_object_or_404(Approve,approvment_slug=slug)            
            serializer = ApproveSerializer(data)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Approve.DoesNotExist:
                return Response({'error':'Approved method not found'},status=status.HTTP_404_NOT_FOUND)