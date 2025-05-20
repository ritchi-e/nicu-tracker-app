from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import Patient, Entry
from .serializers import PatientSerializer, EntrySerializer

class PatientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class EntryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
