import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(
  to: string,
  otp: string,
  type: "password_reset" | "email_verification"
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV MODE] OTP for ${to}: ${otp}`);
    return true;
  }

  const subject =
    type === "password_reset"
      ? "Reset Your Password - AutomateHub"
      : "Verify Your Email - AutomateHub";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #18181b; font-size: 24px; margin: 0;">AutomateHub</h1>
          </div>
          
          <h2 style="color: #18181b; font-size: 20px; margin-bottom: 16px;">
            ${type === "password_reset" ? "Reset Your Password" : "Verify Your Email"}
          </h2>
          
          <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            ${
              type === "password_reset"
                ? "You requested to reset your password. Use the code below to complete the process."
                : "Thank you for signing up! Use the code below to verify your email address."
            }
          </p>
          
          <div style="background: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #18181b;">${otp}</span>
          </div>
          
          <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
          
          <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
            This is an automated message from AutomateHub. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "AutomateHub <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return false;
    }

    console.log(`Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
