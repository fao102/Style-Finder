from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_outfitsearch_color_outfitsearch_fit_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="outfitsearch",
            name="results",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
