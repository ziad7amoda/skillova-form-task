from django.db.backends.signals import connection_created
from django.dispatch import receiver

from .custom_metrics import registered_users_count

_initialized = False


@receiver(connection_created)
def initialize_gauges(sender, connection, **kwargs):
    global _initialized
    if _initialized:
        return
    _initialized = True
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        registered_users_count.set(User.objects.filter(is_active=True).count())
    except Exception:
        _initialized = False
