CREATE TABLE
    users (
        id BIGSERIAL PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        role_id BIGINT NOT NULL REFERENCES roles (id) ON DELETE RESTRICT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW (),
        updated_at TIMESTAMPTZ DEFAULT NOW ()
    );