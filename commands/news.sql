CREATE TABLE news (
    id BIGSERIAL PRIMARY KEY,

    created_by BIGINT
        REFERENCES users(id)
        ON DELETE SET NULL,

    title VARCHAR(255) NOT NULL,
    summary VARCHAR(500),
    content TEXT NOT NULL,
    cover_image_url TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft', 'published', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);
