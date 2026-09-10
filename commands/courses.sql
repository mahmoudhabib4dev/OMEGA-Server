CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,

    created_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    teacher_id BIGINT
        REFERENCES teachers(user_id)
        ON DELETE SET NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);