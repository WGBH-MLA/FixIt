#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mla_game.settings")

    from django.core.management import execute_from_command_line
    from django.conf import settings

    if hasattr(settings, 'NEWRELIC_CONFIG_PATH'):
        import newrelic.agent
        newrelic.agent.initialize(
            settings.NEWRELIC_CONFIG_PATH, settings.NEWRELIC_ENV
        )

    execute_from_command_line(sys.argv)
