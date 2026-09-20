CREATE TABLE about_us (
    id BIGSERIAL PRIMARY KEY,

    -- groups rows into sections, e.g. 'story', 'mission', 'vision', 'team_member', 'stat'
    section_type VARCHAR(50) NOT NULL DEFAULT 'story',

    title VARCHAR(255),
    content TEXT,
    image_url TEXT,

    display_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
