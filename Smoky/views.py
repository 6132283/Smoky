from django.shortcuts import render

from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    return render(
        request,
        'Smoky/index.html',

    )

def charts(request):
    return render(
        request,
        'otherpages/charts.html',

    )

def tables(request):
    return render(
        request,
        'otherpages/tables.html',

    )

def buttons(request):
    return render(
        request,
        'otherpages/buttons.html',
    )
def settings(request):
    return render(
        request,
        'otherpages/settings.html',
    )

