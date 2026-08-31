CREATE TABLE
    students (
        user_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
        university VARCHAR(150),
        stage VARCHAR(20) NOT NULL DEFAULT 'national_exam' CHECK (
            stage IN (
                '1st_year',
                '2nd_year',
                '3rd_year',
                '4th_year',
                '5th_year',
                '6th_year',
                'national_exam'
            )
        )
    );