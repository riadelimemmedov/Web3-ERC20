# Generated by Django 4.2.3 on 2023-08-18 06:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('transfer', '0002_transaction'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Transaction',
        ),
    ]
