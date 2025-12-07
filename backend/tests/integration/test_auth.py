# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos INC

import pytest

from django.urls import reverse
from django.core import mail

from .. import factories

pytestmark = pytest.mark.django_db


@pytest.fixture
def register_form():
    return {"username": "username",
            "password": "password",
            "full_name": "fname",
            "email": "user@email.com",
            "accepted_terms": True,
            "type": "public"}

#################
# registration
#################

def test_respond_201_when_public_registration_is_enabled(client, settings, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201


def test_respond_400_when_public_registration_is_disabled(client, register_form, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400


def test_respond_400_when_the_email_domain_isnt_in_allowed_domains(client, register_form, settings):
    settings.PUBLIC_REGISTER_ENABLED = True
    settings.USER_EMAIL_ALLOWED_DOMAINS = ['other-domain.com']
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400


def test_respond_201_when_the_email_domain_is_in_allowed_domains(client, settings, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True
    settings.USER_EMAIL_ALLOWED_DOMAINS = ['email.com']
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201


def test_response_200_in_public_registration(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = True
    form = {
        "type": "public",
        "username": "mmcfly",
        "full_name": "martin seamus mcfly",
        "email": "mmcfly@bttf.com",
        "password": "password",
        "accepted_terms": True,
    }

    response = client.post(reverse("auth-register"), form)
    assert response.status_code == 201
    assert response.data["username"] == "mmcfly"
    assert response.data["email"] == "mmcfly@bttf.com"
    assert response.data["full_name"] == "martin seamus mcfly"
    assert len(mail.outbox) == 1
    assert mail.outbox[0].subject == "You've been Taigatized!"


def test_respond_400_if_username_is_invalid(client, settings, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form.update({"username": "User Examp:/e"})
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

    register_form.update({"username": 300*"a"})
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400


def test_respond_400_if_username_or_email_is_duplicate(client, settings, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True

    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201

    register_form["username"] = "username"
    register_form["email"] = "ff@dd.com"
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400


def test_register_success_throttling(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = True
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["register-success"] = "1/minute"

    register_form = {"username": "valid_username_register_success",
                     "password": "valid_password",
                     "full_name": "fullname",
                     "email": "",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

    register_form = {"username": "valid_username_register_success",
                     "password": "valid_password",
                     "full_name": "fullname",
                     "email": "valid_username_register_success@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201

    register_form = {"username": "valid_username_register_success2",
                     "password": "valid_password2",
                     "full_name": "fullname",
                     "email": "valid_username_register_success2@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 429

    register_form = {"username": "valid_username_register_success2",
                     "password": "valid_password2",
                     "full_name": "fullname",
                     "email": "",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 429

    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["register-success"] = None


INVALID_NAMES = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    "an <script>evil()</script> example",
    "http://testdomain.com",
    "https://testdomain.com",
    "Visit http://testdomain.com",
]

@pytest.mark.parametrize("full_name", INVALID_NAMES)
def test_register_sanitize_invalid_user_full_name(client, settings, full_name, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True
    register_form["full_name"] = full_name
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

VALID_NAMES = [
    "martin seamus mcfly"
]

@pytest.mark.parametrize("full_name", VALID_NAMES)
def test_register_sanitize_valid_user_full_name(client, settings, full_name, register_form):
    settings.PUBLIC_REGISTER_ENABLED = True
    register_form["full_name"] = full_name
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201


def test_registration_case_insensitive_for_username_and_password(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form = {"username": "Username",
                     "password": "password",
                     "full_name": "fname",
                     "email": "User@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201

    # Email is case insensitive in the register process
    register_form = {"username": "username2",
                     "password": "password",
                     "full_name": "fname",
                     "email": "user@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

    # Username is case insensitive in the register process too
    register_form = {"username": "username",
                     "password": "password",
                     "full_name": "fname",
                     "email": "user2@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400


#################
# autehtication
#################

def test_get_auth_token_with_username(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 200, response.data
    assert "auth_token" in response.data and response.data["auth_token"]
    assert "refresh" in response.data and response.data["refresh"]


def test_get_auth_token_with_username_case_insensitive(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.username.upper(),
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 200, response.data
    assert "auth_token" in response.data and response.data["auth_token"]
    assert "refresh" in response.data and response.data["refresh"]


def test_get_auth_token_with_email(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.email,
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 200, response.data
    assert "auth_token" in response.data and response.data["auth_token"]
    assert "refresh" in response.data and response.data["refresh"]


def test_get_auth_token_with_email_case_insensitive(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.email.upper(),
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 200, response.data
    assert "auth_token" in response.data and response.data["auth_token"]
    assert "refresh" in response.data and response.data["refresh"]


def test_get_auth_token_with_project_invitation(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()
    membership = factories.MembershipFactory(user=None)

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
        "invitation_token": membership.token,
    }

    assert membership.user == None

    response = client.post(reverse("auth-list"), auth_data)
    membership.refresh_from_db()

    assert response.status_code == 200, response.data
    assert "auth_token" in response.data and response.data["auth_token"]
    assert "refresh" in response.data and response.data["refresh"]
    assert membership.user == user


def test_get_auth_token_error_invalid_credentials(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": "bad username",
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 401, response.data

    auth_data = {
        "username": user.username,
        "password": "invalid password",
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 401, response.data


def test_get_auth_token_error_inactive_user(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory(is_active=False)

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 401, response.data


def test_get_auth_token_error_inactive_user(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory(is_active=False)

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 401, response.data

def test_get_auth_token_error_system_user(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory(is_system=True)

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }

    response = client.post(reverse("auth-list"), auth_data)

    assert response.status_code == 401, response.data


def test_auth_uppercase_ignore(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form = {"username": "Username",
                     "password": "password",
                     "full_name": "fname",
                     "email": "User@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 201

    #Only exists one user with the same lowercase version of username/password
    login_form = {"type": "normal",
                  "username": "Username",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 200

    login_form = {"type": "normal",
                  "username": "User@email.com",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 200

    # Email is case insensitive in the register process
    register_form = {"username": "username2",
                     "password": "password",
                     "full_name": "fname",
                     "email": "user@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

    # Username is case insensitive in the register process too
    register_form = {"username": "username",
                     "password": "password",
                     "full_name": "fname",
                     "email": "user2@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)
    assert response.status_code == 400

    #Now we create a legacy user so we have two users with the same lowercase version of username/email
    legacy_user = factories.UserFactory(
            username="username",
            full_name="fname",
            email="user@email.com")
    legacy_user.set_password("password")


    login_form = {"type": "normal",
                  "username": "Username",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 200

    login_form = {"type": "normal",
                  "username": "User@email.com",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 200

    # 2.- If we capitalize a new version it doesn't work with username
    login_form = {"type": "normal",
                  "username": "uSername",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 401

    # neither with the email
    login_form = {"type": "normal",
                  "username": "uSer@email.com",
                  "password": "password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 401


def test_login_fail_throttling(client, settings):
    settings.PUBLIC_REGISTER_ENABLED = True
    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["login-fail"] = "1/minute"

    register_form = {"username": "valid_username_login_fail",
                     "password": "valid_password",
                     "full_name": "fullname",
                     "email": "valid_username_login_fail@email.com",
                     "accepted_terms": True,
                     "type": "public"}
    response = client.post(reverse("auth-register"), register_form)

    login_form = {"type": "normal",
                  "username": "valid_username_login_fail",
                  "password": "valid_password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 200, response.data

    login_form = {"type": "normal",
                  "username": "invalid_username_login_fail",
                  "password": "invalid_password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 401, response.data

    login_form = {"type": "normal",
                  "username": "invalid_username_login_fail",
                  "password": "invalid_password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 429, response.data

    login_form = {"type": "normal",
                  "username": "valid_username_login_fail",
                  "password": "valid_password"}

    response = client.post(reverse("auth-list"), login_form)
    assert response.status_code == 429, response.data

    settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["login-fail"] = None


#################
# Token Refresh
#################

def test_refresh_token_success(client, settings):
    """Test successful token refresh returns new access token.
    
    Covers: auth/api.py lines 90-93, auth/services.py lines 81-104
    """
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    # First, login to get tokens
    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }
    response = client.post(reverse("auth-list"), auth_data)
    assert response.status_code == 200
    refresh_token = response.data["refresh"]

    # Now refresh the token
    refresh_data = {"refresh": refresh_token}
    response = client.post(reverse("auth-refresh"), refresh_data)

    assert response.status_code == 200
    assert "auth_token" in response.data


def test_refresh_token_with_invalid_token(client, settings):
    """Test refresh with invalid token returns 400.
    
    Covers: auth/services.py lines 82-85 (TokenError handling)
    """
    settings.PUBLIC_REGISTER_ENABLED = False

    refresh_data = {"refresh": "invalid_refresh_token"}
    response = client.post(reverse("auth-refresh"), refresh_data)

    assert response.status_code == 400


def test_refresh_token_with_expired_token(client, settings):
    """Test refresh with expired token returns 400.
    
    Covers: auth/services.py lines 82-85 (TokenError handling)
    """
    from datetime import timedelta
    from unittest.mock import patch
    from taiga.auth.tokens import RefreshToken
    from taiga.auth.utils import aware_utcnow

    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    # Create an expired refresh token
    fake_now = aware_utcnow() - timedelta(days=10)
    with patch('taiga.auth.tokens.aware_utcnow') as fake_aware_utcnow:
        fake_aware_utcnow.return_value = fake_now
        expired_token = RefreshToken.for_user(user)

    refresh_data = {"refresh": str(expired_token)}
    response = client.post(reverse("auth-refresh"), refresh_data)

    assert response.status_code == 400


#################
# Token Verify
#################

def test_verify_token_forbidden_in_production(client, settings):
    """Test verify endpoint returns 403 when DEBUG=False.
    
    Covers: auth/api.py lines 98-99
    """
    settings.DEBUG = False
    user = factories.UserFactory()

    # First, login to get tokens
    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }
    response = client.post(reverse("auth-list"), auth_data)
    auth_token = response.data["auth_token"]

    verify_data = {"token": auth_token}
    response = client.post(reverse("auth-verify"), verify_data)

    assert response.status_code == 403


def test_verify_token_success_in_debug_mode(client, settings):
    """Test verify endpoint works when DEBUG=True.
    
    Covers: auth/api.py lines 101-103, auth/services.py lines 107-109
    """
    settings.DEBUG = True
    user = factories.UserFactory()

    # First, login to get tokens
    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
    }
    response = client.post(reverse("auth-list"), auth_data)
    auth_token = response.data["auth_token"]

    verify_data = {"token": auth_token}
    response = client.post(reverse("auth-verify"), verify_data)

    assert response.status_code == 200


def test_verify_token_invalid_in_debug_mode(client, settings):
    """Test verify endpoint with invalid token in DEBUG mode.
    
    Covers: auth/api.py lines 101-103
    """
    settings.DEBUG = True

    verify_data = {"token": "invalid.jwt.token"}
    response = client.post(reverse("auth-verify"), verify_data)

    assert response.status_code == 400


#################
# Private Registration
#################

def test_private_registration_with_valid_invitation_token(client, settings):
    """Test new user registration via invitation token.
    
    Covers: auth/api.py lines 119-124, auth/services.py lines 180-211
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    membership = factories.MembershipFactory(user=None)

    register_form = {
        "username": "new_private_user",
        "password": "securepassword123",
        "full_name": "Private User",
        "email": "private_user@email.com",
        "accepted_terms": True,
        "type": "private",
        "token": membership.token,
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 201
    assert response.data["username"] == "new_private_user"
    assert response.data["email"] == "private_user@email.com"

    # Verify membership was assigned
    membership.refresh_from_db()
    assert membership.user is not None
    assert membership.user.username == "new_private_user"


def test_private_registration_with_duplicate_username(client, settings):
    """Test private registration fails with duplicate username.
    
    Covers: auth/services.py lines 186-188 (is_user_already_registered check)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    existing_user = factories.UserFactory(username="existing_user")
    membership = factories.MembershipFactory(user=None)

    register_form = {
        "username": "existing_user",  # Duplicate
        "password": "securepassword123",
        "full_name": "Private User",
        "email": "new_email@email.com",
        "accepted_terms": True,
        "type": "private",
        "token": membership.token,
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 400


def test_private_registration_with_duplicate_email(client, settings):
    """Test private registration fails with duplicate email.
    
    Covers: auth/services.py lines 186-188 (is_user_already_registered check)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    existing_user = factories.UserFactory(email="existing@email.com")
    membership = factories.MembershipFactory(user=None)

    register_form = {
        "username": "new_unique_user",
        "password": "securepassword123",
        "full_name": "Private User",
        "email": "existing@email.com",  # Duplicate
        "accepted_terms": True,
        "type": "private",
        "token": membership.token,
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 400


#################
# Registration Edge Cases
#################

def test_register_with_invalid_type(client, settings):
    """Test registration with invalid type raises 400.
    
    Covers: auth/api.py line 140
    """
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form = {
        "username": "testuser",
        "password": "password",
        "full_name": "Test User",
        "email": "test@email.com",
        "accepted_terms": True,
        "type": "invalid_type",
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 400


def test_register_without_accepting_terms(client, settings):
    """Test registration fails when terms not accepted.
    
    Covers: auth/api.py lines 129-131
    """
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form = {
        "username": "testuser",
        "password": "password",
        "full_name": "Test User",
        "email": "test@email.com",
        "accepted_terms": False,
        "type": "public",
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 400


def test_register_with_terms_not_provided(client, settings):
    """Test registration fails when terms field not provided.
    
    Covers: auth/api.py lines 129-131
    """
    settings.PUBLIC_REGISTER_ENABLED = True

    register_form = {
        "username": "testuser",
        "password": "password",
        "full_name": "Test User",
        "email": "test@email.com",
        # accepted_terms not provided
        "type": "public",
    }

    response = client.post(reverse("auth-register"), register_form)
    
    assert response.status_code == 400


#################
# Login Edge Cases
#################

def test_login_with_invalid_type(client, settings):
    """Test login with invalid type raises 400.
    
    Covers: auth/api.py lines 78-79
    """
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "invalid_auth_type",
    }

    response = client.post(reverse("auth-list"), auth_data)
    
    assert response.status_code == 400


def test_login_with_empty_type(client, settings):
    """Test login without type uses 'normal' by default (empty string).
    
    Covers: auth/api.py line 71 (login_type default handling)
    """
    settings.PUBLIC_REGISTER_ENABLED = False
    user = factories.UserFactory()

    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "",  # Empty type should use default
    }

    response = client.post(reverse("auth-list"), auth_data)
    
    # Empty type is not "normal", so it should fail
    assert response.status_code == 400


###############################################################################
# ADDITIONAL COVERAGE TESTS - Added to cover missed lines
###############################################################################

def test_register_with_invalid_type(client, settings):
    """Test registration with invalid type raises 400.
    
    Covers: auth/api.py line 140 (else branch for invalid registration type)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    register_data = {
        "username": "test_invalid_type",
        "password": "password123",
        "full_name": "Test User",
        "email": "invalid_type@email.com",
        "accepted_terms": True,
        "type": "neither_public_nor_private",
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_register_without_accepted_terms(client, settings):
    """Test registration without accepted_terms raises 400.
    
    Covers: auth/api.py lines 129-131
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    register_data = {
        "username": "test_no_terms",
        "password": "password123",
        "full_name": "Test User",
        "email": "noterms@email.com",
        "accepted_terms": False,
        "type": "public",
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_register_with_accepted_terms_none(client, settings):
    """Test registration with accepted_terms=None raises 400.
    
    Covers: auth/api.py lines 129-131
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    register_data = {
        "username": "test_terms_none",
        "password": "password123",
        "full_name": "Test User",
        "email": "termsnone@email.com",
        "type": "public",
        # accepted_terms omitted (None)
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_register_duplicate_username(client, settings):
    """Test registration with duplicate username raises 400.
    
    Covers: auth/services.py lines 134-136 (is_user_already_registered username check)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    user = factories.UserFactory(username="duplicate_user")
    
    register_data = {
        "username": "duplicate_user",
        "password": "password123",
        "full_name": "Test User",
        "email": "new_unique@email.com",
        "accepted_terms": True,
        "type": "public",
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_register_duplicate_email(client, settings):
    """Test registration with duplicate email raises 400.
    
    Covers: auth/services.py lines 138-139 (is_user_already_registered email check)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    user = factories.UserFactory(email="duplicate@email.com")
    
    register_data = {
        "username": "new_unique_user",
        "password": "password123",
        "full_name": "Test User",
        "email": "duplicate@email.com",
        "accepted_terms": True,
        "type": "public",
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_verify_forbidden_when_not_debug(client, settings):
    """Test verify endpoint returns 403 when not in DEBUG mode.
    
    Covers: auth/api.py lines 98-99
    """
    settings.DEBUG = False
    
    response = client.post(reverse("auth-verify"), {"token": "any_token"})
    assert response.status_code == 403


def test_login_with_invitation_token(client, settings):
    """Test login with invitation token processes invitation.
    
    Covers: auth/api.py lines 82-84 (invitation token processing)
    """
    settings.PUBLIC_REGISTER_ENABLED = False
    
    user = factories.UserFactory()
    membership = factories.MembershipFactory(user=None)
    
    auth_data = {
        "username": user.username,
        "password": user.username,
        "type": "normal",
        "invitation_token": membership.token,
    }
    
    response = client.post(reverse("auth-list"), auth_data)
    
    assert response.status_code == 200
    membership.refresh_from_db()
    assert membership.user == user


def test_private_registration_success(client, settings):
    """Test private registration with valid token.
    
    Covers: auth/services.py lines 180-211 (private_register_for_new_user)
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    membership = factories.MembershipFactory(user=None)
    
    register_data = {
        "username": "new_private_user",
        "password": "password123",
        "full_name": "Private User",
        "email": "private_user@email.com",
        "accepted_terms": True,
        "type": "private",
        "token": membership.token,
    }
    
    response = client.post(reverse("auth-register"), register_data)
    
    assert response.status_code == 201
    membership.refresh_from_db()
    assert membership.user is not None


def test_private_registration_duplicate_username(client, settings):
    """Test private registration with duplicate username.
    
    Covers: auth/services.py lines 186-188
    """
    settings.PUBLIC_REGISTER_ENABLED = True
    
    existing_user = factories.UserFactory(username="existing_private_user")
    membership = factories.MembershipFactory(user=None)
    
    register_data = {
        "username": "existing_private_user",
        "password": "password123",
        "full_name": "Private User",
        "email": "newprivate@email.com",
        "accepted_terms": True,
        "type": "private",
        "token": membership.token,
    }
    
    response = client.post(reverse("auth-register"), register_data)
    assert response.status_code == 400


def test_refresh_token_invalid(client):
    """Test refresh with invalid token returns 401.
    
    Covers: auth/services.py lines 82-85 (TokenError -> InvalidToken)
    """
    response = client.post(reverse("auth-refresh"), {"refresh": "invalid_token"})
    assert response.status_code == 401


def test_refresh_token_success(client):
    """Test refresh with valid token returns new tokens.
    
    Covers: auth/services.py lines 81-104
    """
    from taiga.auth.tokens import RefreshToken
    
    user = factories.UserFactory()
    refresh = RefreshToken.for_user(user)
    
    response = client.post(reverse("auth-refresh"), {"refresh": str(refresh)})
    
    assert response.status_code == 200
    assert "auth_token" in response.data


def test_token_denylist(client):
    """Test denylisted token is rejected on refresh.
    
    Covers: auth/tokens.py lines 217-244 (DenylistMixin)
    """
    from taiga.auth.tokens import RefreshToken
    
    user = factories.UserFactory()
    refresh = RefreshToken.for_user(user)
    
    # Denylist the token
    refresh.denylist()
    
    # Try to use the denylisted token
    response = client.post(reverse("auth-refresh"), {"refresh": str(refresh)})
    assert response.status_code == 401

