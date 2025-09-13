-- hospital a
INSERT INTO "users" (
    "displayName",
    "email",
    "password",
    "isSuperAdmin",
    "roles",
    "tenantId"
) VALUES 
(
    'Hospital A User 1',
    'user1@hospital_a.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    false,
    ARRAY['STAFF_USER']::users_roles_enum[],
    'df7100e6-02ff-4d7d-8f36-93f9b7135c33'
),
(
    'Hospital A User 2',
    'user2@hospital_a.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    true,
    ARRAY['STAFF_USER']::users_roles_enum[],
    'df7100e6-02ff-4d7d-8f36-93f9b7135c33'
);


-- hospital b
INSERT INTO "users" (
    "displayName",
    "email",
    "password",
    "isSuperAdmin",
    "roles",
    "tenantId"
) VALUES 
(
    'Hospital B User 1',
    'user1@hospital_b.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    false,
    ARRAY['STAFF_USER']::users_roles_enum[],
    '40f48db8-339d-410f-820d-9d72d93cf82e'
),
(
    'Hospital B User 2',
    'user2@hospital_b.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    true,
    ARRAY['STAFF_USER']::users_roles_enum[],
    '40f48db8-339d-410f-820d-9d72d93cf82e'
);
