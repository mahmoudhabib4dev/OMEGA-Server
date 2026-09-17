CREATE TABLE
    home_carousel (
        id BIGSERIAL PRIMARY KEY,
        img TEXT NOT NULL,
        title VARCHAR(150) NOT NULL,
        subtitle VARCHAR(150) NOT NULL,
        content TEXT NOT NULL,
        btn_link TEXT
    );

CREATE TABLE
    landing_page_video (url TEXT NOT NULL);