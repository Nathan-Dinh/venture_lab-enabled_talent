-- ===============================
-- USER TYPE & SUBSCRIPTION TYPE
-- ===============================

CREATE TABLE user_type (
    usertype_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

CREATE TABLE subscription_type (
    subscription_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL
);

-- ===============================
-- USERS
-- ===============================

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    usertype_id INT REFERENCES user_type(usertype_id) ON DELETE SET NULL,
    subscription_type_id INT REFERENCES subscription_type(subscription_type_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    headline VARCHAR(255),
    bio TEXT,
    profile_image_url TEXT,
    location VARCHAR(255)
);

-- ===============================
-- SKILLS & USER SKILLS
-- ===============================

CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(150) NOT NULL,
    category VARCHAR(100)
);

CREATE TABLE user_skills (
    user_skill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
    skill_level INT CHECK (skill_level BETWEEN 1 AND 10),
    endorsed_count INT DEFAULT 0
);

CREATE TABLE skill_endorsements (
    endorser_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    user_skill_id INT REFERENCES user_skills(user_skill_id) ON DELETE CASCADE,
    endorsed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (endorser_id, user_skill_id)
);

-- ===============================
-- EXPERIENCE / EDUCATION / CERTIFICATIONS
-- ===============================

CREATE TABLE user_experience (
    experience_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_education (
    education_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    institution_name VARCHAR(255),
    degree VARCHAR(255),
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT
);

CREATE TABLE user_certifications (
    certification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255),
    organization VARCHAR(255),
    issue_date DATE,
    expiration_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT
);

-- ===============================
-- PROFILE VIEWS & POSTS
-- ===============================

CREATE TABLE profile_views (
    viewer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    viewed_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (viewer_id, viewed_user_id)
);

CREATE TABLE user_posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT,
    media_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    visibility VARCHAR(50) DEFAULT 'public'
);

-- ===============================
-- PAYMENT & PRICING
-- ===============================

CREATE TABLE payment_information (
    payment_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    payment_method VARCHAR(50),
    card_last_four CHAR(4),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_pricing (
    pricing_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    rate DECIMAL(10,2),
    currency VARCHAR(10)
);

-- ===============================
-- AVAILABILITY & BOOKINGS
-- ===============================

CREATE TABLE user_availability (
    availability_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(50)
);

CREATE TABLE user_booking (
    booking_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    mentor_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    booking_time TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50)
);

CREATE TABLE session (
    session_id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE REFERENCES user_booking(booking_id) ON DELETE CASCADE,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    session_status VARCHAR(50)
);

-- ===============================
-- FOLLOWING SYSTEM
-- ===============================

CREATE TABLE user_following (
    follower_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    followed_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id)
);

-- ===============================
-- MESSAGING SYSTEM
-- ===============================

CREATE TABLE conversation (
    conversation_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_member (
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(50),
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversation(conversation_id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    message_text TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);
