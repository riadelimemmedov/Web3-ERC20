

#! Django function and methods
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator,FileExtensionValidator


#! Serializers class and models
from approve.models import Approve
from blockchain_server.models import BlockChainServer


#! Third Party Packages
from django_extensions.db.fields import AutoSlugField,RandomCharField
from django_extensions.db.models import TimeStampedModel


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)



#*Transaction
class Transaction(TimeStampedModel):
    transaction_id = RandomCharField(verbose_name='Transaction id', length = 15, unique=True,include_alpha=False)
    transaction_slug = AutoSlugField(verbose_name='Transaction slug value',populate_from='transaction_id', unique=True, blank=True,null=True)
    transaction_hash  = models.CharField(verbose_name='Transaction hash',max_length = 100,blank=False)#FrontEnd
    transaction_from = models.CharField(verbose_name='Transaction from account',max_length=100,blank=False,validators=[validate_metamask_address])#Sender account,FrontEnd
    transaction_to = models.CharField(verbose_name='Transaction to account',max_length=100,blank=False,validators=[validate_metamask_address])#Receiver account,FrontEnd
    transaction_amount  = models.FloatField(verbose_name='Amount of transaction',blank=True,validators=[validate_amount])#FrontEnd
    token_name = models.CharField(verbose_name='Token name',max_length=50,null=True)
    token_symbol = models.CharField(verbose_name='Token symbol',max_length=50,null=True)
    network = models.CharField(verbose_name='Network name',max_length=50,null=True)
    is_succsess = models.BooleanField(verbose_name='Is succsess', default=False)
    blockchain_server = models.CharField(verbose_name='Blockchain server', max_length=50,blank=False,null=True)
    confirmations = models.IntegerField(verbose_name='Confirmed transaction value', default=0)#FrontEnd
    
    def __str__(self):
        return f"{self.transaction_from} - {self.transaction_to} - {self.transaction_amount} - {self.is_succsess}"

    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
