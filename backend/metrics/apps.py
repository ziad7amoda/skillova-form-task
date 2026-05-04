from django.apps import AppConfig


class MetricsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'metrics'

    def ready(self):
        from . import signals  # noqa: F401
        from . import gauges  # noqa: F401
