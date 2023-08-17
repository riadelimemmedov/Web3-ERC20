

#! Django function and methods
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator,FileExtensionValidator


#! Serializers class and models
from approve.models import Approve


#! Third Party Packages
from django_extensions.db.fields import AutoSlugField,RandomCharField
from django_extensions.db.models import TimeStampedModel


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#*Transfer
class Transfer(TimeStampedModel):
    transfer_id = RandomCharField(verbose_name='Transfer id', length = 15, unique=True,include_alpha=False)
    transfer_slug = AutoSlugField(verbose_name='Transfer slug value',populate_from='transfer_id', unique=True, blank=True,null=True)
    transfer_hash  = models.CharField(verbose_name='Transfer hash',max_length = 100,blank=False)#FrontEnd
    transfer_approvement = models.ForeignKey(Approve,verbose_name='Transfer approvment',on_delete=models.CASCADE,blank=False)
    transfer_from = models.CharField(verbose_name='Transfer from account',max_length=100,blank=False,validators=[validate_metamask_address])#Sender account,FrontEnd
    transfer_to = models.CharField(verbose_name='Transfer to account',max_length=100,blank=False,validators=[validate_metamask_address])#Receiver account,FrontEnd
    transfer_amount  = models.FloatField(verbose_name='Amount of transfer',blank=True,validators=[validate_amount])#FrontEnd
    is_transfer = models.BooleanField(verbose_name='Is transfer', default=False)
    confirmations = models.IntegerField(verbose_name='Confirmed transfer value', default=0)#FrontEnd
    
    def __str__(self):
        return f"{self.transfer_from} - {self.transfer_to} - {self.transfer_amount} - {self.is_transfer}"

    class Meta:
        verbose_name = 'Transfer'
        verbose_name_plural = 'Transfers'
        
        
        


#*Transaction
class Transaction(TimeStampedModel):
    transaction_id = RandomCharField(verbose_name='Transaction id', length = 15, unique=True,include_alpha=False)
    transaction_slug = AutoSlugField(verbose_name='Transaction slug value',populate_from='transfer_id', unique=True, blank=True,null=True)
    transaction_hash  = models.CharField(verbose_name='Transaction hash',max_length = 100,blank=False)#FrontEnd
    transaction_from = models.CharField(verbose_name='Transaction from account',max_length=100,blank=False,validators=[validate_metamask_address])#Sender account,FrontEnd
    transaction_to = models.CharField(verbose_name='Transaction to account',max_length=100,blank=False,validators=[validate_metamask_address])#Receiver account,FrontEnd
    transaction_amount  = models.FloatField(verbose_name='Transaction of transfer',blank=True,validators=[validate_amount])#FrontEnd
    is_succsess = models.BooleanField(verbose_name='Is succsess', default=False)
    confirmations = models.IntegerField(verbose_name='Confirmed transfer value', default=0)#FrontEnd
    
    def __str__(self):
        return f"{self.transfer_from} - {self.transfer_to} - {self.transfer_amount} - {self.is_transfer}"

    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
