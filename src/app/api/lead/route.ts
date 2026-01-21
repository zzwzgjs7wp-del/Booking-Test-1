export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
const leadsFile = path.join(dataDir, "leads.json");

async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function saveLeadToFile(data: any) {
  await ensureDataDir();
  let leads: any[] = [];
  
  try {
    const fileContent = await fs.readFile(leadsFile, "utf-8");
    leads = JSON.parse(fileContent);
  } catch {
    // File doesn't exist yet, start with empty array
  }
  
  leads.push({
    ...data,
    timestamp: new Date().toISOString(),
  });
  
  await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
}

async function sendEmail(data: any) {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || siteConfig.email;
  const smtpTo = process.env.SMTP_TO || siteConfig.email;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.log("SMTP not configured, skipping email send");
    return { success: false, skipped: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isBooking = data.type === "booking";
    const subject = isBooking
      ? `New Service Request: ${data.service}`
      : `New Contact Form: ${data.subject}`;

    const htmlContent = `
      <h2>${isBooking ? "New Service Request" : "New Contact Form Submission"}</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      ${isBooking ? `
        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>ZIP:</strong> ${data.zip}</p>
        <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
        <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
        ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
      ` : `
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `}
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject: subject,
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: String(error) };
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Save to file (always works)
    await saveLeadToFile(data);

    // Try to send email (may fail if SMTP not configured)
    const emailResult = await sendEmail(data);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll get back to you soon.",
        emailSent: emailResult.success,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or call us directly.",
      },
      { status: 500 }
    );
  }
}
