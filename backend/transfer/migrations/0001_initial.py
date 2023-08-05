# Generated by Django 4.2.3 on 2023-08-05 03:53

import config.helpers
from django.db import migrations, models
import django.db.models.deletion
import django_extensions.db.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('approve', '0002_alter_approve_amount'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transfer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', django_extensions.db.fields.CreationDateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(auto_now=True, verbose_name='modified')),
                ('transfer_id', django_extensions.db.fields.RandomCharField(blank=True, editable=False, include_alpha=False, length=15, unique=True, verbose_name='Transfer id')),
                ('transfer_slug', django_extensions.db.fields.AutoSlugField(blank=True, editable=False, null=True, populate_from='transfer_id', unique=True, verbose_name='Transfer slug value')),
                ('transfer_hash', models.CharField(max_length=100, verbose_name='Transfer hash')),
                ('transfer_from', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Transfer from account')),
                ('transfer_to', models.CharField(max_length=100, validators=[config.helpers.validate_metamask_address], verbose_name='Transfer to account')),
                ('transfer_amount', models.FloatField(blank=True, validators=[config.helpers.validate_amount], verbose_name='Amount of transfer')),
                ('is_transfer', models.BooleanField(default=False, verbose_name='Is transfer')),
                ('confirmations', models.IntegerField(default=0, verbose_name='Confirmed transfer value')),
                ('transfer_approvement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='approve.approve', verbose_name='Transfer approvment')),
            ],
            options={
                'verbose_name': 'Transfer',
                'verbose_name_plural': 'Transfers',
            },
        ),
    ]