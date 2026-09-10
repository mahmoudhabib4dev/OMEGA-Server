CREATE TABLE course_materials (
    id BIGSERIAL PRIMARY KEY,

    course_id BIGINT NOT NULL
        REFERENCES courses(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,

    material_type VARCHAR(50) NOT NULL DEFAULT 'external_link'
        CHECK (material_type IN ('pdf', 'article', 'book', 'external_link')),

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);