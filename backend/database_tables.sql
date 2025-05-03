CREATE TABLE SocialMedia (
    media_name VARCHAR(100) PRIMARY KEY
);

CREATE TABLE UserAccount (
    username VARCHAR(100) NOT NULL,
    media_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_country VARCHAR(100),
    residence_country VARCHAR(100),
    age INT,
    gender VARCHAR(1),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(username, media_name),
    FOREIGN KEY (media_name) REFERENCES SocialMedia(media_name) ON DELETE CASCADE
);

CREATE TABLE Post (
    post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    media_name VARCHAR(100) NOT NULL,
    content VARCHAR(1000) NOT NULL,
    post_time TIMESTAMP,
    city VARCHAR(100),
    state_name VARCHAR(100),
    country VARCHAR(100),
    likes INT,
    dislikes INT,
    multimedia VARCHAR(100),
    project_name VARCHAR(100),
    field_name VARCHAR(100),
    is_repost BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT post_user_platform UNIQUE(post_id, username, media_name),
    FOREIGN KEY (username, media_name) REFERENCES UserAccount(username, media_name) ON DELETE CASCADE
);

CREATE TABLE Repost (
    repost_id INT PRIMARY KEY,
    original_id INT NOT NULL,
    repost_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(100) NOT NULL,
    media_name VARCHAR(100) NOT NULL,
    CONSTRAINT no_simultaneous_reposts UNIQUE (username, media_name, repost_time),
    FOREIGN KEY (repost_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (original_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (username, media_name) REFERENCES UserAccount(username, media_name) ON DELETE CASCADE
);

CREATE TABLE Project (
    project_name VARCHAR(100) NOT NULL PRIMARY KEY,
    project_description VARCHAR(100),
    project_manager_first VARCHAR(100) NOT NULL,
    project_manager_last VARCHAR(100) NOT NULL,
    institute VARCHAR(100),
    start_date DATE,
    end_date DATE
);

CREATE TABLE Field (
    field_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    UNIQUE KEY (field_id, project_name),
    FOREIGN KEY (project_name) REFERENCES Project(project_name) ON DELETE CASCADE
);

CREATE TABLE AnalysisResult (
    result_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    field_id INT NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    result_data VARCHAR(100),
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (field_id, project_name) REFERENCES Field(field_id, project_name) ON DELETE CASCADE
);

INSERT INTO SocialMedia (media_name) VALUES 
    ('Facebook'),
    ('Twitter'),
    ('Instagram'),
    ('LinkedIn'),
    ('Snapchat');
