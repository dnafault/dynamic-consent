from graphene import Field, List, Mutation, String, Int
from datetime import datetime
from dynamic_consent_backend.models.user import UserModel
from dynamic_consent_backend.object_types.user import User


class CreateUser(Mutation):
    class Arguments:
        email = String()
        first_name = String()
        last_name = String()
        date_of_birth = String()

    user = Field(lambda: User)

    def mutate(root, info, email, first_name, last_name, date_of_birth):
        user = UserModel(
            email=email,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=datetime.fromtimestamp(int(date_of_birth) / 1000.0).date(),
        )
        user.save()
        return CreateUser(user=user)


class UpdateUser(Mutation):
    class Arguments:
        id = String(required=True)
        email = String()
        first_name = String()
        last_name = String()

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, id, email=None, first_name=None, last_name=None):
        user = UserModel.objects.get(id=id)
        if email:
            user.email = email
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name

        user.save()
        return UpdateUser(user=user)


class AddConsentOrgs(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(Int)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_orgs.append(consent_id)

        user.save()
        return AddConsentOrgs(user=user)


class RevokeConsentOrgs(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(Int)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_orgs.remove(consent_id)

        user.save()
        return RevokeConsentOrgs(user=user)


class AddConsentPurposes(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_purposes.append(consent_id)

        user.save()
        return AddConsentPurposes(user=user)


class RevokeConsentPurposes(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_purposes.remove(consent_id)

        user.save()
        return RevokeConsentOrgs(user=user)


class AddConsentHPOs(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_hpos.append(consent_id)

        user.save()
        return AddConsentHPOs(user=user)


class RevokeConsentHPOs(Mutation):
    class Arguments:
        user_id = String(required=True)
        consent_ids = List(String)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, user_id, consent_ids):
        user = UserModel.objects.get(id=user_id)

        for consent_id in consent_ids:
            user.consent_hpos.remove(consent_id)

        user.save()
        return RevokeConsentHPOs(user=user)


class DeleteUser(Mutation):
    class Arguments:
        id = String(required=True)

    user = Field(lambda: User)

    @staticmethod
    def mutate(root, info, id):
        user = UserModel.objects.get(id=id)
        user.delete()
        return DeleteUser(user=user)
