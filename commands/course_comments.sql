CREATE TABLE course_comments (
    id BIGSERIAL PRIMARY KEY,

    course_id BIGINT NOT NULL
        REFERENCES courses(id)
        ON DELETE CASCADE,

    student_id BIGINT NOT NULL
        REFERENCES students(user_id)
        ON DELETE CASCADE,

    comment_text TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);