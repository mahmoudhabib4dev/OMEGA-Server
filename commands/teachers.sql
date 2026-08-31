CREATE TABLE
    teachers (
        user_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        specialty VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        license_number VARCHAR(100) UNIQUE NOT NULL,
        years_experience INTEGER NOT NULL CHECK (years_experience >= 0),
        workplace VARCHAR(150),
        bio TEXT,
        cv_url VARCHAR(255),
        current_city VARCHAR(100),
        rating DECIMAL(2, 1) DEFAULT 0.0,
        approval_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
            approval_status IN ('pending', 'approved', 'rejected')
        ),
        reviewed_by BIGINT REFERENCES users (id) ON DELETE SET NULL,
        reviewed_at TIMESTAMPTZ,
        admin_notes TEXT
    );