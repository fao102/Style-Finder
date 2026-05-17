from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0004_outfitsearch_clerk_user_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="outfitsearch",
            name="refined_label",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
