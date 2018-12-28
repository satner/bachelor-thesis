const forgotPasswordEmailTXT = token => {
  return `
  Use this link to reset your password. The link is only valid for 24 hours.

TeamMate ( https://teammate.gg )

************
Hi
************

You recently requested to reset your password for your TeamMate account. Use the button below to reset it. This password reset is only valid for the next 5 minutes.

Reset your password ( http://localhost:3000/reset-password?token=${token} )

Thanks,
The TeamMate Team

© 2018 TeamMate. All rights reserved.

TeamMate
  `;
};

export default forgotPasswordEmailTXT;
