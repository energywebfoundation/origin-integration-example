/*
 ORGANIZATIONS
 */
INSERT INTO public.organization ("createdAt", "updatedAt", id, "activeCountries", code, name, contact, telephone, email, address, shareholders, "ceoPassportNumber", "ceoName", "companyNumber", "vatNumber", postcode, "headquartersCountry", country, "businessTypeSelect", "businessTypeInput", "yearOfRegistration", "numberOfEmployees", website, status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 1, '[236]', '1', 'Issuer Organization', 'Contact', '1', 'issuer@example.com', 'Address', '1', '1', 'CEO name', '', 'XY123456', '1', '236', '236', 'Private individual', '', '2020', '1', 'http://example.com', '2');

INSERT INTO public.organization ("createdAt", "updatedAt", id, "activeCountries", code, name, contact, telephone, email, address, shareholders, "ceoPassportNumber", "ceoName", "companyNumber", "vatNumber", postcode, "headquartersCountry", country, "businessTypeSelect", "businessTypeInput", "yearOfRegistration", "numberOfEmployees", website, status)
  VALUES ('2020-03-30 09:55:25.962333+02', '2020-03-30 09:55:25.962333+02', 2, '[236]', '1', 'Trader Organization', 'Contact', '1', 'trader@example.com', 'Address', '1', '1', 'CEO name', '', 'XY123456', '1', '236', '236', 'Private individual', '', '2020', '1', 'http://example.com', '2');


/*
 USERS
 */
INSERT INTO public. "user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, PASSWORD, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus")
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 1, 'Mr', 'Issuer', 'Surname', 'issuer@example.com', '111-111-111', '$2a$08$KG7OAbLQPCRCNXiw9veGMeCuH8eD/HmxV8CMZjaFr3QebXR4gRCD.', '', '', 'f', 8, '1', '1', '1');

INSERT INTO public. "user" ("createdAt", "updatedAt", id, title, "firstName", "lastName", email, telephone, PASSWORD, "blockchainAccountAddress", "blockchainAccountSignedMessage", notifications, rights, "organizationId", status, "kycStatus")
  VALUES ('2020-03-30 10:08:33.510625+02', '2020-03-30 10:08:33.652639+02', 2, 'Mr', 'Trader', 'USA', 'organization-admin@example.com', '111-111-111', '$2a$08$j8LnGtFdbTfKN5F.0InfdO2gxMWXHbrjWvRziCIl0lRj.kxOKJ/b6', '', '', 'f', 16, '2', '1', '1');

SELECT
  setval(pg_get_serial_sequence('public.user', 'id'), (
      SELECT
        MAX("id")
      FROM public.user) + 1);

SELECT
  setval(pg_get_serial_sequence('public.organization', 'id'), (
      SELECT
        MAX("id")
      FROM public.organization) + 1);

