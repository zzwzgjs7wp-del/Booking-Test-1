-- Enable Row Level Security on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_weekly_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE churn_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Businesses: Users can read businesses they're members of, create new ones, update their own
CREATE POLICY "Users can view businesses they belong to"
  ON businesses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = businesses.id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update businesses they belong to"
  ON businesses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = businesses.id
      AND business_members.user_id = auth.uid()
    )
  );

-- Business members: Users can view members of their businesses, add themselves
CREATE POLICY "Users can view members of their businesses"
  ON business_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      WHERE bm.business_id = business_members.business_id
      AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add themselves to businesses"
  ON business_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can manage members"
  ON business_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      WHERE bm.business_id = business_members.business_id
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'admin')
    )
  );

-- Services: Members can manage services for their businesses
CREATE POLICY "Members can view services of their businesses"
  ON services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = services.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create services for their businesses"
  ON services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = services.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update services of their businesses"
  ON services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = services.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete services of their businesses"
  ON services FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = services.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Staff: Members can manage staff for their businesses
CREATE POLICY "Members can view staff of their businesses"
  ON staff FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = staff.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create staff for their businesses"
  ON staff FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = staff.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update staff of their businesses"
  ON staff FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = staff.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete staff of their businesses"
  ON staff FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = staff.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Staff weekly hours: Members can manage availability
CREATE POLICY "Members can view staff hours"
  ON staff_weekly_hours FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      JOIN staff s ON s.business_id = bm.business_id
      WHERE s.id = staff_weekly_hours.staff_id
      AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can manage staff hours"
  ON staff_weekly_hours FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      JOIN staff s ON s.business_id = bm.business_id
      WHERE s.id = staff_weekly_hours.staff_id
      AND bm.user_id = auth.uid()
    )
  );

-- Staff time off: Members can manage time off
CREATE POLICY "Members can view staff time off"
  ON staff_time_off FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      JOIN staff s ON s.business_id = bm.business_id
      WHERE s.id = staff_time_off.staff_id
      AND bm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can manage staff time off"
  ON staff_time_off FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM business_members bm
      JOIN staff s ON s.business_id = bm.business_id
      WHERE s.id = staff_time_off.staff_id
      AND bm.user_id = auth.uid()
    )
  );

-- Customers: Members can manage customers for their businesses
CREATE POLICY "Members can view customers of their businesses"
  ON customers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = customers.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create customers for their businesses"
  ON customers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = customers.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update customers of their businesses"
  ON customers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = customers.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Appointments: Members can manage appointments for their businesses
CREATE POLICY "Members can view appointments of their businesses"
  ON appointments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = appointments.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create appointments for their businesses"
  ON appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = appointments.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update appointments of their businesses"
  ON appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = appointments.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can delete appointments of their businesses"
  ON appointments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = appointments.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Reviews: Members can view and create reviews for their businesses
CREATE POLICY "Members can view reviews of their businesses"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = reviews.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create reviews for their businesses"
  ON reviews FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = reviews.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Review summaries: Members can view summaries of their businesses
CREATE POLICY "Members can view review summaries of their businesses"
  ON review_summaries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = review_summaries.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Churn snapshots: Members can view churn data for their businesses
CREATE POLICY "Members can view churn snapshots of their businesses"
  ON churn_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = churn_snapshots.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Churn suggestions: Members can view and update suggestions for their businesses
CREATE POLICY "Members can view churn suggestions of their businesses"
  ON churn_suggestions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = churn_suggestions.business_id
      AND business_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can update churn suggestions of their businesses"
  ON churn_suggestions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = churn_suggestions.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Subscriptions: Members can view subscriptions of their businesses
CREATE POLICY "Members can view subscriptions of their businesses"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_members
      WHERE business_members.business_id = subscriptions.business_id
      AND business_members.user_id = auth.uid()
    )
  );

-- Jobs: Members can manage jobs for their businesses
DROP POLICY IF EXISTS "Jobs are service role only" ON jobs;

CREATE POLICY "jobs_crud_member"
  ON jobs FOR ALL
  USING (is_business_member(business_id, auth.uid()))
  WITH CHECK (is_business_member(business_id, auth.uid()));
