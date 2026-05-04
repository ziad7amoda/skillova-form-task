from prometheus_client import Counter, Gauge

submissions_created_total = Counter(
    'submissions_created_total',
    'Total number of submissions created',
    ['type'],
)

users_registered_total = Counter(
    'users_registered_total',
    'Total number of users registered',
)

api_errors_total = Counter(
    'api_errors_total',
    'Total number of API errors',
    ['view', 'status_code'],
)

registered_users_count = Gauge(
    'registered_users_count',
    'Current number of active registered users',
)
