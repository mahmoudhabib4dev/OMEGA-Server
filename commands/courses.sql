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
    price NUMERIC(10, 2) NOT NULL DEFAULT 0
        CHECK (price >= 0),
    target_years VARCHAR(20)[] NOT NULL
        DEFAULT ARRAY['national_exam']::VARCHAR(20)[],

    CHECK (cardinality(target_years) > 0),
    CHECK (target_years <@ ARRAY[
        '1st_year',
        '2nd_year',
        '3rd_year',
        '4th_year',
        '5th_year',
        '6th_year',
        'national_exam'
    ]::VARCHAR(20)[]),

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);