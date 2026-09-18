CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,

    student_id BIGINT NOT NULL
        REFERENCES students(user_id)
        ON DELETE CASCADE,

    course_id BIGINT NOT NULL
        REFERENCES courses(id)
        ON DELETE RESTRICT,

    offer_id BIGINT
        REFERENCES course_offers(id)
        ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'pending_payment'
        CHECK (status IN (
            'pending_payment',
            'active',
            'cancelled',
            'completed',
            'rejected'
        )),

    refund_status VARCHAR(20) NOT NULL DEFAULT 'not_required'
        CHECK (refund_status IN (
            'not_required',
            'pending',
            'refunded',
            'failed'
        )),

    agreed_price NUMERIC(10, 2) NOT NULL
        CHECK (agreed_price >= 0),

    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    refund_eligible_until TIMESTAMPTZ NOT NULL
        DEFAULT (NOW() + INTERVAL '1 day'),
    cancelled_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    cancellation_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CHECK (cancelled_at IS NULL OR status = 'cancelled'),
    CHECK (refunded_at IS NULL OR refund_status = 'refunded')
);

CREATE UNIQUE INDEX one_open_enrollment_per_student_course
    ON enrollments (student_id, course_id)
    WHERE status IN ('pending_payment', 'active');