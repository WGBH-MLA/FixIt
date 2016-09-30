from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import requires_csrf_token


@login_required
@requires_csrf_token
def upload_batch(request):
    pass
