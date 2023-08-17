#

#!Rest framework
from rest_framework import serializers



#!Models and Serializers
from .models import Transfer,Transaction
from approve.models import Approve
from approve.serializers import ApproveSerializer


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#?TransferSerializer
class TransferSerializer(serializers.ModelSerializer):
    # transfer_approvement = serializers.PrimaryKeyRelatedField(queryset=Approve.objects.all(),source="transfer_approvement.pk")
    
    
    class Meta:
        model = Transfer
        fields = ['transfer_hash','transfer_from','transfer_to','transfer_amount','is_transfer','confirmations','transfer_id','transfer_approvement']
        
    
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
        return transfer
    
    
    

#?TransactionSerializer
class TransactionSerializer(serializers.ModelSerializer):
    
    
    class Meta:
        model = Transaction
        fields = ['transaction_hash','transaction_from','transaction_to','transaction_amount','is_succsess','confirmations','transaction_id','transaction_approvement']
        
    
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
        return transaction