#

#!Rest framework
from rest_framework import serializers


#!Models and Serializers
from .models import Transaction
from approve.models import Approve
from blockchain_server.models import BlockChainServer
from approve.serializers import ApproveSerializer


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#?TransactionSerializer
class TransactionSerializer(serializers.ModelSerializer):    
    # blockchain_server = serializers.CharField(source="blockchain_server.server_name",read_only=True)
    
    
    class Meta:
        model = Transaction
        fields = ['transaction_hash','transaction_from','transaction_to','transaction_amount','is_succsess','confirmations','transaction_id','blockchain_server','token_name','token_symbol','network','created']
        
    
    #validating transaction_from and transaction_to
    def validate(self,data):
        transaction_from = data['transaction_from']
        transaction_to = data['transaction_to']        
        if validate_metamask_address(transaction_from) and validate_metamask_address(transaction_to):
            return data
    


    #validate_transaction_amount
    def validate_transaction_amount(self,data):
        if validate_amount(data):
            return data
    
    
    #to_representation
    def to_representation(self, instance):
        transaction = super().to_representation(instance)
        transaction.pop('transaction_hash')
        
        # blockchain_server = BlockChainServer.objects.first().server_name
        # for key in transaction:
        #     if key == 'blockchain_server':
        #         transaction.update({key:blockchain_server})
        return transaction
