from rest_framework.views import exception_handler as drf_default_handler
from .custom_metrics import api_errors_total


def custom_exception_handler(exc, context):
    response = drf_default_handler(exc, context)

    if response is not None:
        view = context.get('view', None)
        view_name = type(view).__name__ if view else 'unknown'
        api_errors_total.labels(
            view=view_name,
            status_code=str(response.status_code),
        ).inc()

    return response
