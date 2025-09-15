from rest_framework.permissions import BasePermission

class IsRH(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'rh'

class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'manager'
