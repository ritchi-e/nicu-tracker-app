from django.contrib import admin
from .models import Patient, Entry

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'name', 'ga', 'weight', 'aga_sga_lga', 'sex', 'dob', 'tob')
    search_fields = ('patient_id', 'name')
    list_filter = ('aga_sga_lga', 'sex')
    ordering = ('patient_id',)

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ('patient', 'date', 'kmc', 'cal', 'protein', 'weight', 'dol', 'pma', 'type_of_milk')
    list_filter = ('date', 'type_of_milk', 'mode_of_feeding')
    search_fields = ('patient__patient_id', 'patient__name', 'tfr', 'feeds')
    raw_id_fields = ('patient',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('patient', 'date', 'dol', 'pma')
        }),
        ('Nutrition', {
            'fields': ('kmc', 'cal', 'protein', 'weight', 'feeds', 'type_of_milk', 'hmf')
        }),
        ('Supplements', {
            'fields': ('calcium', 'phosphorus', 'vit_d', 'iron', 'zinc', 'caffeine')
        }),
        ('Clinical Status', {
            'fields': ('resp_support', 'desaturations', 'acute_events', 'piomi')
        }),
        ('Other', {
            'fields': ('tfr', 'nns', 'gain_loss', 'early_intervention', 'mode_of_feeding')
        }),
    )
