#

#!Rest framework
from rest_framework import serializers



#!Models and Serializers
from .models import Transfer
from approve.models import Approve
from blockchain_server.models import BlockChainServer
from approve.serializers import ApproveSerializer


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#?TransferSerializer
class TransferSerializer(serializers.ModelSerializer):
    # transfer_approvement = serializers.PrimaryKeyRelatedField(queryset=Approve.objects.all(),source="transfer_approvement.pk")
    # blockchain_server = serializers.CharField(source="blockchain_server.server_name",read_only=True)
    # blockchain_server = serializers.StringRelatedField()
    
    
    class Meta:
        model = Transfer
        fields = ['transfer_hash','transfer_from','transfer_to','transfer_amount','is_transfer','confirmations','transfer_id','transfer_approvement','blockchain_server','token_name','token_symbol','network','created']
        
    
    #validating transfer_from and transfer_to
    def validate(self,data):
        transfer_from = data['transfer_from']
        transfer_to = data['transfer_to']        
        if validate_metamask_address(transfer_from) and validate_metamask_address(transfer_to):
            return data
    

    
    #validate_transfer_amount
    def validate_transfer_amount(self,data):
        if validate_amount(data):
            return data
    
    
    #to_representation
    def to_representation(self, instance):
        transfer = super().to_representation(instance)
        transfer.pop('transfer_hash')
        
        # blockchain_server = BlockChainServer.objects.first().server_name
        # for key in transfer:
        #     if key == 'blockchain_server':
        #         transfer.update({key:blockchain_server})
        return transfer
