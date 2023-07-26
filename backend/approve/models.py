

#! Django function and methods
from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator,FileExtensionValidator

#! Serializers class


#! Third Party Packages
from django_extensions.db.fields import AutoSlugField,RandomCharField
from django_extensions.db.models import TimeStampedModel


#!Helpers methods
from config.helpers import (validate_metamask_address,validate_amount)


# Create your models here.

#*Approve
class Approve(TimeStampedModel):
    approvment_id = RandomCharField(verbose_name='Approvment account id', length = 15, unique=True,include_alpha=False)
    approvment_slug = AutoSlugField(verbose_name='Approvment slug value',populate_from='approvment_id', unique=True, blank=True,null=True)
    approvment_hash  = models.CharField(verbose_name='Approvment hash',max_length = 100,blank=False)#FrontEnd
    confirmed_account = models.CharField(verbose_name='Confirmed account',max_length=100,blank=False,validators=[validate_metamask_address])#Onaylanan hesab,FrontEnd
    confirming_account = models.CharField(verbose_name='Confirming account',max_length=100,blank=False,validators=[validate_metamask_address])#Onaylayan hesab,FrontEnd
    amount = models.FloatField(verbose_name='Amount of approve',blank=True,validators=[validate_amount])#FrontEnd
    is_approve = models.BooleanField(verbose_name='Is approve', default=False)
    confirmations = models.IntegerField(verbose_name='Confirmed approvement value', default=0)#FrontEnd
    
    
    def __str__(self):
        return f"{self.confirmed_account} - {self.confirming_account} - {self.amount} - {self.is_approve}"

    class Meta:
        verbose_name = 'Approve'
        verbose_name_plural = 'Approvements'
