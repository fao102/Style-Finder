from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0003_outfitsearch_results"),
    ]

    operations = [
        migrations.AddField(
            model_name="outfitsearch",
            name="clerk_user_id",
            field=models.CharField(blank=True, db_index=True, max_length=255, null=True),
        ),
    ]
