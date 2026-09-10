CREATE TABLE videos (
    id BIGSERIAL PRIMARY KEY,

    course_id BIGINT
        REFERENCES courses(id)
        ON DELETE SET NULL,

    uploaded_by BIGINT NOT NULL
        REFERENCES users(id)
        ON DELETE RESTRICT,

    title VARCHAR(255) NOT NULL,
    video_guid VARCHAR(255) NOT NULL UNIQUE,

    duration_seconds INTEGER
        CHECK (duration_seconds IS NULL OR duration_seconds >= 0),

    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);