from django.contrib import admin

from markdownx.admin import MarkdownxModelAdmin

from .models import Message


class MessageAdmin(MarkdownxModelAdmin):
    list_display = ('message', 'active')


admin.site.register(Message, MessageAdmin)
