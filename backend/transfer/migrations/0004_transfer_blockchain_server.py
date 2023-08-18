# Generated by Django 4.2.3 on 2023-08-18 08:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blockchain_server', '0002_alter_blockchainserver_options'),
        ('transfer', '0003_delete_transaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='transfer',
            name='blockchain_server',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='blockchain_server.blockchainserver', verbose_name='Blockchain server transfer'),
        ),
    ]