
#!Python modules
import uuid
import re
from datetime import datetime


#!Django function and methods
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.text import slugify




#?metamask_address_validator
def validate_metamask_address(value):
    if not re.match(r'^0x[0-9a-fA-F]{40}$', value):
        raise ValidationError('Metamask address wallet format is not valid. Please check your account from Metamask, then try again.')


#?validate_amount
def validate_amount(value):
    if value <= 0:
        raise ValidationError('You have approve minimum 1 token')
    