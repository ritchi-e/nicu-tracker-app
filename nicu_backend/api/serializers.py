from rest_framework import serializers
from .models import Patient, Entry

class EntrySerializer(serializers.ModelSerializer):
    kmc = serializers.FloatField(required=False, allow_null=True)
    cal = serializers.FloatField(required=False, allow_null=True)
    protein = serializers.FloatField(required=False, allow_null=True)
    weight = serializers.FloatField(required=False, allow_null=True)

    class Meta:
        model = Entry
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    entries = EntrySerializer(many=True, read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'
