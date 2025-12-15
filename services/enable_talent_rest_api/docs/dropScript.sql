-- ======================================
-- DROP DATABASE AND TABLES (RESET SCRIPT)
-- ======================================

-- Drop database if it exists (disconnect all sessions first)
DO
$$
BEGIN
   IF EXISTS (SELECT FROM pg_database WHERE datname = 'enabled_talent') THEN
      PERFORM pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'enabled_talent';
      EXECUTE 'DROP DATABASE enabled_talent';
   END IF;
END
$$;

-- Recreate database
CREATE DATABASE enabled_talent;

-- Connect to the new database
\c enabled_talent;

-- ===============================
-- DROP ALL TABLES (safety fallback)
-- ===============================

DROP TABLE IF EXISTS 
    messages,
    conversation_member,
    conversation,
    user_following,
    session,
    user_booking,
    user_availability,
    user_pricing,
    payment_information,
    user_posts,
    profile_views,
    user_certifications,
    user_education,
    user_experience,
    skill_endorsements,
    user_skills,
    skills,
    users,
    subscription_type,
    user_type
CASCADE;
