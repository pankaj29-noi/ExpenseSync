// // We have to add domain name here so it working fine 

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInvitationEmail = async (
  email: string, 
  invitedByName: string, 
  groupName: string, 
  groupId: string
) => {
  try {
    
    const loginLink = `${process.env.CLIENT_URL}/log?invited=true&email=${email}&group=${groupId}&invitedBy=${invitedByName}`;

    const { data, error } = await resend.emails.send({
      from: 'ExpenseSync <onboarding@resend.dev>',
      to: email, 
      subject: `Join ${groupName} on ExpenseSync! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background: #f9fafb;
            }
            .container {
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #10B981, #059669);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .button {
              background: #10B981;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #6B7280;
              font-size: 12px;
              border-top: 1px solid #E5E7EB;
              background: #f9fafb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Invited!</h1>
              <p>Join your friends on ExpenseSync</p>
            </div>
            
            <div class="content">
              <p>Hello there! 👋</p>
              
              <p><strong style="color: #10B981;">${invitedByName}</strong> has invited you to join the group:</p>
              
              <div style="background: #ECFDF5; padding: 16px; border-radius: 8px; border-left: 4px solid #10B981; margin: 20px 0;">
                <h3 style="margin: 0; color: #065F46;">"${groupName}"</h3>
              </div>
              
              <p>ExpenseSync helps you track, split, and manage shared expenses with friends and groups. Never worry about who owes what again! 💰</p>
              
              <div style="text-align: center;">
                <a href="${loginLink}" class="button">
                  Join ${groupName}
                </a>
              </div>
              
              <p style="color: #6B7280; font-size: 14px; text-align: center;">
                Once you register, ${invitedByName} can add you to the group and you can start tracking shared expenses together.
              </p>
            </div>
            
            <div class="footer">
              <p>Sent via ExpenseSync • Easy expense splitting with friends</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
    return data;
  } catch (error) {
    throw error;
  }
};


