/*
 ORGANIZATIONS
 */
INSERT INTO public."platform_organization" ("createdAt", "updatedAt", id, name, address, city, "zipCode", country, "businessType", "tradeRegistryCompanyNumber", "vatNumber", "signatoryFullName", "signatoryAddress", "signatoryCity", "signatoryZipCode", "signatoryCountry", "signatoryEmail", "signatoryPhoneNumber", status )
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 1, 'Issuer Organization', 'Address', 'City', 'Zip code', 235, 'Issuer', '1000', 'UK1000', 'Issuer signatory', 'Address', 'City', 'Zip code', 235, 'issuer@example.com', 'Phone number', 2);

INSERT INTO public."platform_organization" ("createdAt", "updatedAt", id, name, address, city, "zipCode", country, "businessType", "tradeRegistryCompanyNumber", "vatNumber", "signatoryFullName", "signatoryAddress", "signatoryCity", "signatoryZipCode", "signatoryCountry", "signatoryEmail", "signatoryPhoneNumber", status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 2, 'Trader Organization', 'Address', 'City', 'Zip code', 235, 'Trader', '1000', 'UK1000', 'Trader signatory', 'Address', 'City', 'Zip code', 235, 'trader@example.com', 'Phone number', 2);

INSERT INTO public. "platform_organization" ("createdAt", "updatedAt", id, name, address, city, "zipCode", country, "businessType", "tradeRegistryCompanyNumber", "vatNumber", "signatoryFullName", "signatoryAddress", "signatoryCity", "signatoryZipCode", "signatoryCountry", "signatoryEmail", "signatoryPhoneNumber", status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 3, 'Platform Operator Organization', 'Address', 'City', 'Zip code', 235, 'Issuer', '1000', 'UK1000', 'Operator', 'Address', 'City', 'Zip code', 235, 'admin@mailinator.com', 'Phone number', 2);


/*
 USERS
 */
INSERT INTO public."user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, password, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus" )
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 1, 'Mr', 'Issuer', 'Surname', 'issuer@example.com', '111-111-111', '$2a$08$KG7OAbLQPCRCNXiw9veGMeCuH8eD/HmxV8CMZjaFr3QebXR4gRCD.', '0xd173313a51f8fc37bcf67569b463abd89d81844f', '0x09790e96275e023b965f6b267512b5267bcb18f5b5fdaaf46de899a0f91f2a8d006c7fbaebddf5ad36c116775c961aca3c32525b6dd1529bdee41eee5e9730a71c', 'f', 8, 1, '1', '1');

INSERT INTO public."user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, password, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus" )
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 2, 'Mr', 'Trader', 'Surname', 'trader@example.com', '111-111-111', '$2a$08$j8LnGtFdbTfKN5F.0InfdO2gxMWXHbrjWvRziCIl0lRj.kxOKJ/b6', '0x7672fa3f8c04abbcbad14d896aad8bedece72d2b', '0xb0a804f410f2934278703eb992e5ba12f9e8b9068b68ff6d1246a56cf52e48677d3648057453d86f4372b2ffd98fa189aee1562d8c564ac62bc416d6cdc474051c', 'f', '1', 2, '1', '1');

INSERT INTO "public"."user" ("createdAt", "updatedAt", "id", "title", "firstName", "lastName", "email", "telephone", "password", "blockchainAccountAddress", "blockchainAccountSignedMessage", "notifications", "rights", "organizationId", "status", "kycStatus")
  VALUES ('2020-03-30 08:08:33.510625+00', '2020-03-30 08:08:33.652639+00', 3, 'Mr', 'Admin', 'Surname', 'admin@example.com', '111-111-111', '$2a$08$j8LnGtFdbTfKN5F.0InfdO2gxMWXHbrjWvRziCIl0lRj.kxOKJ/b6', '0x7672fa3f8c04abbcbad14d896aad8bedece72d2b', '0xb0a804f410f2934278703eb992e5ba12f9e8b9068b68ff6d1246a56cf52e48677d3648057453d86f4372b2ffd98fa189aee1562d8c564ac62bc416d6cdc474051c', 'f', '16', 3, '1', '1');

INSERT INTO "public"."user" ("createdAt", "updatedAt", "id", "title", "firstName", "lastName", "email", "telephone", "password", "blockchainAccountAddress", "blockchainAccountSignedMessage", "notifications", "rights", "organizationId", "status", "kycStatus")
  VALUES ('2020-03-30 08:08:33.510625+00', '2020-03-30 08:08:33.652639+00', 4, 'Mr', 'Agents', 'Surname', 'agents@example.com', '111-111-111', '$2a$08$j8LnGtFdbTfKN5F.0InfdO2gxMWXHbrjWvRziCIl0lRj.kxOKJ/b6', '0x7672fa3f8c04abbcbad14d896aad8bedece72d2b', '0xb0a804f410f2934278703eb992e5ba12f9e8b9068b68ff6d1246a56cf52e48677d3648057453d86f4372b2ffd98fa189aee1562d8c564ac62bc416d6cdc474051c', 'f', '32', 3, '1', '1');

SELECT
  setval(pg_get_serial_sequence('public.user', 'id'), (
      SELECT
        MAX("id")
      FROM public.user) + 1);

SELECT
    setval(pg_get_serial_sequence('public.platform_organization', 'id'), (
      SELECT
          MAX("id")
      FROM public.platform_organization) + 1);
