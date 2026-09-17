CREATE TABLE course_offers (
    id BIGSERIAL PRIMARY KEY,

    course_id BIGINT NOT NULL
        REFERENCES courses(id)
        ON DELETE CASCADE,

    UNIQUE (course_id),

    title VARCHAR(255) NOT NULL,
    description TEXT,
    offer_price NUMERIC(10, 2) NOT NULL
        CHECK (offer_price >= 0),

    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (ends_at IS NULL OR ends_at > starts_at)
);
