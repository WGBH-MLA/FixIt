from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from .models import Profile


@receiver(user_logged_in)
def get_or_create_profile(sender, user, request, **kwargs):
    profile, created = Profile.objects.get_or_create(
        user=user
    )
    if created:
        profile.save()

    return profile
