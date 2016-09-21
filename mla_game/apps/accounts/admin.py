from django.contrib import admin
from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    model = Profile


admin.site.register(Profile, ProfileAdmin)
