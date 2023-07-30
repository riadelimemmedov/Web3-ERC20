#

#!Rest framework
from rest_framework import serializers

#!Models
from .models import *



#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#?ApproveSerializer
class ApproveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Approve
        fields = ['approvment_hash','confirmed_account','confirming_account','amount','is_approve','confirmations','approvment_id']
        
    
    #validating confirmed_account and confirming_account
    def validate(self,data):
        confirmed_account = data['confirmed_account']
        confirming_account = data['confirming_account']        
        if validate_metamask_address(confirmed_account) and validate_metamask_address(confirming_account):
            return data
    
    
    #validate_amount
    def validate_amount(self,data):
        if validate_amount(data):
            return data
    
    
    #to_representation
    def to_representation(self, instance):
        approve = super().to_representation(instance)
        approve.pop('approvment_hash')
        return approve