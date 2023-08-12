
#! Django function and methods
from django.db import models

# Create your models here.

#*BlockChainServer
class BlockChainServer(models.Model):
    server_name = models.CharField(verbose_name='Server Name',max_length=100,default='local')
    
    
    def __str__(self):
        return f"{self.server_name}"
    
    class Meta:
        verbose_name = 'BlockChainServer'
        verbose_name_plural = 'BlockChainServers'