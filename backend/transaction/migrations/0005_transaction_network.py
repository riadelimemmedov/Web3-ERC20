# Generated by Django 4.2.3 on 2023-08-18 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transaction', '0004_transaction_token_name_transaction_token_symbol'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='network',
            field=models.CharField(max_length=50, null=True, verbose_name='Network name'),
        ),
    ]
