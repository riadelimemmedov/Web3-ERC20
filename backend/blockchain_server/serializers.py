#

#!Rest framework
from rest_framework import serializers

#!Models
from .models import *



#*BlockChainServerSerializers
class BlockChainServerSerializers(serializers.ModelSerializer):
    class Meta:
        model = BlockChainServer
        fields = '__all__'