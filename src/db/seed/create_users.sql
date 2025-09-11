-- hospital a
INSERT INTO "users" (
    "displayName",
    "email",
    "password",
    "isSuperAdmin",
    "roles"
) VALUES 
(
    'Hospital A User 1',
    'user1@hospital_a.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    false,
    ARRAY['STAFF_USER']::users_roles_enum[]
),
(
    'Hospital A User 2',
    'user2@hospital_a.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    true,
    ARRAY['STAFF_USER']::users_roles_enum[]
);


-- hospital b
INSERT INTO "users" (
    "displayName",
    "email",
    "password",
    "isSuperAdmin",
    "roles"
) VALUES 
(
    'Hospital B User 1',
    'user1@hospital_b.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    false,
    ARRAY['STAFF_USER']::users_roles_enum[]
),
(
    'Hospital B User 2',
    'user2@hospital_b.com',
    '$2b$10$nSmrFW/0P5fZcsFc7FEEouysyLtn0O2JslIlbwSSISwBZL0b8vpF2', -- hash for "12345"
    true,
    ARRAY['STAFF_USER']::users_roles_enum[]
);
