-- Seed data for development
-- This file is optional and can be used to populate test data

-- Create a test business
INSERT INTO businesses (id, name, slug, email, phone, timezone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo HVAC Company', 'demo-hvac', 'demo@hvac.com', '555-0100', 'America/New_York'),
  ('00000000-0000-0000-0000-000000000002', 'Demo Plumbing Co', 'demo-plumbing', 'demo@plumbing.com', '555-0200', 'America/New_York')
ON CONFLICT DO NOTHING;

-- Note: business_members will be created when users sign up and join businesses
-- You'll need to manually link users after creating them via Supabase Auth

-- Create test services
INSERT INTO services (business_id, name, description, duration_minutes, price_cents, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'AC Repair', 'Air conditioning repair service', 60, 15000, true),
  ('00000000-0000-0000-0000-000000000001', 'AC Installation', 'New AC unit installation', 240, 500000, true),
  ('00000000-0000-0000-0000-000000000001', 'Maintenance Check', 'Routine maintenance inspection', 30, 10000, true),
  ('00000000-0000-0000-0000-000000000002', 'Drain Cleaning', 'Clogged drain cleaning service', 60, 20000, true),
  ('00000000-0000-0000-0000-000000000002', 'Leak Repair', 'Plumbing leak repair', 90, 25000, true)
ON CONFLICT DO NOTHING;

-- Create test staff
INSERT INTO staff (business_id, name, email, phone, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'John Smith', 'john@hvac.com', '555-1001', true),
  ('00000000-0000-0000-0000-000000000001', 'Jane Doe', 'jane@hvac.com', '555-1002', true),
  ('00000000-0000-0000-0000-000000000002', 'Bob Johnson', 'bob@plumbing.com', '555-2001', true)
ON CONFLICT DO NOTHING;

-- Create weekly hours (Monday-Friday, 9am-5pm)
INSERT INTO staff_weekly_hours (staff_id, day_of_week, start_time, end_time)
SELECT 
  s.id,
  d.day_of_week,
  '09:00'::TIME,
  '17:00'::TIME
FROM staff s
CROSS JOIN (SELECT unnest(ARRAY[1,2,3,4,5]) AS day_of_week) d
WHERE s.business_id = '00000000-0000-0000-0000-000000000001'
ON CONFLICT DO NOTHING;

INSERT INTO staff_weekly_hours (staff_id, day_of_week, start_time, end_time)
SELECT 
  s.id,
  d.day_of_week,
  '09:00'::TIME,
  '17:00'::TIME
FROM staff s
CROSS JOIN (SELECT unnest(ARRAY[1,2,3,4,5]) AS day_of_week) d
WHERE s.business_id = '00000000-0000-0000-0000-000000000002'
ON CONFLICT DO NOTHING;

-- Create test customers
INSERT INTO customers (business_id, name, email, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Alice Customer', 'alice@example.com', '555-3001'),
  ('00000000-0000-0000-0000-000000000001', 'Bob Customer', 'bob@example.com', '555-3002'),
  ('00000000-0000-0000-0000-000000000002', 'Charlie Customer', 'charlie@example.com', '555-3003')
ON CONFLICT DO NOTHING;
